import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es un expert en systèmes solaires et stockage d'énergie.
Analyse cette brochure produit et extrais toutes les spécifications techniques.

Retourne UNIQUEMENT un JSON structuré. Si une information n'est pas trouvée, mets null. Pour les tableaux, mets un tableau vide [].

D'abord, identifie la catégorie du produit :
- "panneaux" = modules photovoltaïques
- "onduleurs" = onduleurs/inverteurs seuls
- "batteries" = batteries/systèmes de stockage seuls
- "solarbox" = solution intégrée onduleur+batterie

Puis extrais les specs adaptées à la catégorie :

{
  "name": string | null,
  "fabricant": string | null,
  "modele": string | null,
  "category": "panneaux" | "onduleurs" | "batteries" | "solarbox" | null,
  "profile_type": "residential" | "commercial" | "industrial" | null,
  "power_kwc": number | null,
  "price_ttc": number | null,
  "description": string | null,
  "specs": {
    // PANNEAUX : inclure si catégorie = panneaux
    "puissance_wc": number | null,
    "rendement": number | null,
    "voc": number | null,
    "isc": number | null,
    "vmp": number | null,
    "imp": number | null,
    "type_cellule": string[],
    "nb_cellules": number | null,
    "coeff_temp_pmax": number | null,
    "coeff_temp_voc": number | null,
    "poids_kg": number | null,
    "longueur_mm": number | null,

    // ONDULEURS : inclure si catégorie = onduleurs ou solarbox
    "puissance_nominale_kw": number | null,
    "puissance_max_kw": number | null,
    "nb_mppt": number | null,
    "nb_strings": number | null,
    "efficacite_max": number | null,
    "tension_dc_max": number | null,
    "type_onduleur": string[],
    "phases": string[],

    // BATTERIES : inclure si catégorie = batteries ou solarbox
    "capacite_kwh": number | null,
    "capacite_utilisable_kwh": number | null,
    "puissance_decharge_jour_kw": number | null,
    "puissance_decharge_nuit_kw": number | null,
    "puissance_charge_kw": number | null,
    "cycle_vie": number | null,
    "depth_of_discharge": number | null,
    "type_batterie": "LFP" | "NMC" | "NCA" | "Lead-Acid" | null,
    "efficacite_roundtrip": number | null,
    "type_refroidissement": "forced_air" | "natural_convection" | "liquid" | null,

    // COMMUN à tous
    "duree_vie_ans": number | null,
    "garantie_ans": number | null,
    "largeur_mm": number | null,
    "hauteur_mm": number | null,
    "epaisseur_mm": number | null,
    "ip_rating": string | null,
    "temp_min_celsius": number | null,
    "temp_max_celsius": number | null,
    "communication": string[]
  }
}

Règles :
- type_cellule: valeurs possibles = "monocristallin", "polycristallin", "bifacial", "PERC", "TOPCon", "HJT"
- type_onduleur: valeurs possibles = "string", "micro", "hybride", "central"
- phases: valeurs possibles = "monophasé", "triphasé"
- communication: valeurs possibles = "RS485", "Modbus-TCP", "CAN", "4G", "WiFi", "Ethernet"
- N'inclus que les champs pertinents pour la catégorie détectée, les autres restent null
- Convertis toutes les dimensions en mm
- Déduis le profile_type : panneaux <400Wc ou batteries <10kWh = residential, >100kWh = industrial, sinon commercial
- Si le prix n'est pas mentionné, mets null`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "imageBase64 is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
    const mediaType = mimeType || "image/jpeg";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mediaType};base64,${cleanBase64}` },
              },
              {
                type: "text",
                text: "Analyse cette brochure produit solaire/stockage et extrais toutes les spécifications techniques.",
              },
            ],
          },
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "rate_limited", message: "Trop de requêtes, réessayez." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "ai_error", message: "Erreur d'analyse IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      try {
        let fixed = jsonStr.replace(/,\s*$/, "");
        if (!fixed.endsWith("}")) fixed += "}";
        parsed = JSON.parse(fixed);
      } catch {
        console.error("Failed to parse AI response:", content);
        return new Response(
          JSON.stringify({ error: "parse_error", message: "Impossible d'extraire les données de la brochure.", raw: content }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("OCR brochure error:", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
