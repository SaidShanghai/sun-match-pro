import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://sungpt.ma",
  "https://www.sungpt.ma",
  "https://sun-match-pro.lovable.app",
];

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".lovableproject.com") || origin.endsWith(".lovable.app");
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

const SYSTEM_PROMPT = `Tu es un expert en systèmes solaires et stockage d'énergie.
Analyse cette brochure produit et extrais les spécifications techniques.

IMPORTANT:
- Retourne UNIQUEMENT du JSON brut, SANS backticks markdown, SANS texte avant/après.
- description: 1 phrase max (30 mots).
- Omets les champs null pour réduire la taille de la réponse. Ne les inclus que s'ils ont une valeur.
- Si une info n'est pas trouvée, ne l'inclus PAS dans le JSON.

Catégories possibles :
- "panneaux" = modules photovoltaïques
- "onduleurs" = onduleurs/inverteurs seuls
- "batteries" = batteries/systèmes de stockage seuls
- "solarbox" = solution intégrée onduleur+batterie

Structure attendue (n'inclus que les champs avec valeur) :
{
  "name": string,
  "fabricant": string,
  "modele": string,
  "category": "panneaux" | "onduleurs" | "batteries" | "solarbox",
  "profile_type": "residential" | "commercial" | "industrial",
  "power_kwc": number,
  "price_ttc": number,
  "description": string,
  "specs": {
    "puissance_crete_wc": number,
    "rendement_module_pct": number,
    "rendement_cellule_pct": number,
    "voc_v": number,
    "isc_a": number,
    "vmp_v": number,
    "imp_a": number,
    "type_cellule": string[],
    "nb_cellules": number,
    "coeff_temp_pmax_pct_c": number,
    "coeff_temp_voc_pct_c": number,
    "coeff_temp_isc_pct_c": number,
    "poids_kg": number,
    "longueur_mm": number,
    "largeur_mm": number,
    "epaisseur_mm": number,
    "temp_min_c": number,
    "temp_max_c": number,
    "charge_vent_pa": number,
    "charge_neige_pa": number,
    "ip_rating": string,
    "certifications": string,
    "garantie_ans": number,
    "duree_vie_ans": number,
    "puissance_nominale_kw": number,
    "puissance_max_kw": number,
    "nb_mppt": number,
    "nb_strings_par_mppt": number,
    "efficacite_max_pct": number,
    "tension_dc_max_v": number,
    "type_onduleur": string[],
    "phases": string[],
    "capacite_kwh": number,
    "capacite_utilisable_kwh": number,
    "puissance_charge_kw": number,
    "puissance_decharge_kw": number,
    "cycle_vie": number,
    "dod_pct": number,
    "type_batterie": "LFP" | "NMC" | "NCA" | "Lead-Acid",
    "efficacite_roundtrip_pct": number,
    "refroidissement": string,
    "communication": string[]
  }
}

Règles :
- type_cellule: "monocristallin", "polycristallin", "bifacial", "PERC", "TOPCon", "HJT"
- type_onduleur: "string", "micro", "hybride", "central"
- phases: "monophasé", "triphasé"
- communication: "RS485", "Modbus-TCP", "CAN", "4G", "WiFi", "Ethernet"
- refroidissement: "Convection naturelle", "Ventilation forcée", "Refroidissement liquide"
- certifications: liste séparée par virgules ex: "IEC 61215, IEC 61730, CE"
- Convertis dimensions en mm
- profile_type: panneaux <400Wc ou batteries <10kWh = residential, >100kWh = industrial, sinon commercial`;

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;

    // Rate limiting: 10 OCR requests per user per hour
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: isLimited } = await adminClient.rpc("check_rate_limit", {
      _key: `ocr-brochure:${userId}`,
      _max_requests: 10,
      _window_seconds: 3600,
    });

    if (isLimited) {
      return new Response(
        JSON.stringify({ error: "rate_limited", message: "Trop de requêtes. Réessayez dans une heure." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "imageBase64 is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service unavailable" }),
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
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "rate_limited", message: "Trop de requêtes, réessayez." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ error: "ai_error", message: "Erreur d'analyse IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    let jsonStr = content;
    const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fencedMatch) {
      jsonStr = fencedMatch[1].trim();
    } else {
      const openFence = content.match(/```(?:json)?\s*([\s\S]*)/);
      if (openFence) {
        jsonStr = openFence[1].trim();
      }
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      try {
        let fixed = jsonStr.replace(/,\s*$/, "");
        const openBraces = (fixed.match(/{/g) || []).length;
        const closeBraces = (fixed.match(/}/g) || []).length;
        const openBrackets = (fixed.match(/\[/g) || []).length;
        const closeBrackets = (fixed.match(/\]/g) || []).length;
        fixed = fixed.replace(/,?\s*"[^"]*$/, "");
        fixed = fixed.replace(/,?\s*"[^"]*":\s*"?[^",}]*$/, "");
        fixed = fixed.replace(/,\s*$/, "");
        for (let i = 0; i < openBrackets - closeBrackets; i++) fixed += "]";
        for (let i = 0; i < openBraces - closeBraces; i++) fixed += "}";
        parsed = JSON.parse(fixed);
      } catch {
        console.error("Failed to parse AI response");
        return new Response(
          JSON.stringify({ error: "parse_error", message: "Impossible d'extraire les données de la brochure." }),
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
      JSON.stringify({ error: "internal_error", message: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
