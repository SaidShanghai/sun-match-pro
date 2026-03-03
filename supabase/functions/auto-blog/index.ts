import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const GUIDE_TOPICS = [
  "Comment calculer la rentabilité d'une installation solaire au Maroc",
  "Les étapes pour installer des panneaux solaires sur un toit plat au Maroc",
  "Autoconsommation solaire au Maroc : tout ce qu'il faut savoir",
  "Comment lire sa facture ONEE et optimiser sa consommation",
  "Panneaux solaires monocristallins vs polycristallins : quel choix pour le Maroc",
  "Les erreurs courantes à éviter lors d'une installation solaire",
  "Le dimensionnement d'une installation solaire pour une maison marocaine",
  "Batteries solaires au Maroc : sont-elles rentables en 2025 ?",
  "L'entretien des panneaux solaires : guide pratique pour le Maroc",
  "Comment choisir un installateur solaire certifié au Maroc",
  "Les onduleurs solaires : comment choisir le bon modèle",
  "Énergie solaire pour les commerces au Maroc : guide complet",
  "Net metering au Maroc : injecter son surplus dans le réseau ONEE",
  "Les subventions AMEE pour le solaire résidentiel en 2025",
  "Solaire thermique vs photovoltaïque : lequel choisir au Maroc",
];

const ACTUALITE_TOPICS = [
  "Les nouvelles réglementations solaires au Maroc en 2025",
  "Le marché du solaire au Maroc : tendances et chiffres clés",
  "Noor Ouarzazate : bilan et impact sur l'énergie solaire marocaine",
  "Les startups marocaines qui révolutionnent le solaire",
  "Le Maroc, leader africain de l'énergie solaire",
  "COP et énergie solaire : les engagements du Maroc",
  "Les innovations technologiques dans le solaire au Maroc",
  "L'impact du solaire sur l'emploi au Maroc",
  "Les projets solaires géants prévus au Maroc",
  "Le financement vert au Maroc : opportunités pour le solaire",
  "Transition énergétique au Maroc : objectifs 2030",
  "Le rôle de l'IRESEN dans la recherche solaire marocaine",
  "Smart grids et solaire : l'avenir du réseau électrique marocain",
  "Les coopératives solaires au Maroc : un modèle émergent",
  "Hydrogène vert et solaire au Maroc : une combinaison gagnante",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase env vars");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Alternate category: check last post category
    const { data: lastPost } = await supabase
      .from("blog_posts")
      .select("category")
      .order("published_at", { ascending: false })
      .limit(1)
      .single();

    const category = lastPost?.category === "guide" ? "actualite" : "guide";
    const topics = category === "guide" ? GUIDE_TOPICS : ACTUALITE_TOPICS;

    // Pick a random topic
    const topic = topics[Math.floor(Math.random() * topics.length)];

    // Generate article via Lovable AI
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `Tu es un expert en énergie solaire au Maroc. Tu rédiges des articles de blog professionnels et informatifs pour NOORIA, une startup marocaine spécialisée dans l'accompagnement solaire.

Règles :
- Écris en français, ton professionnel mais accessible
- Format Markdown avec titres (##), sous-titres (###), listes à puces, et paragraphes
- L'article doit faire entre 800 et 1200 mots
- Inclus des données chiffrées quand pertinent (tarifs ONEE, prix moyens, etc.)
- Termine par un appel à l'action mentionnant NOORIA et SunGPT
- N'invente pas de statistiques, reste factuel
- Catégorie : ${category === "guide" ? "Guide pratique" : "Actualité"}`,
            },
            {
              role: "user",
              content: `Rédige un article complet sur le sujet suivant : "${topic}"`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "create_blog_post",
                description:
                  "Structure the blog post with title, excerpt, meta_description, and content",
                parameters: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "Titre accrocheur de l'article (max 80 caractères)",
                    },
                    excerpt: {
                      type: "string",
                      description: "Résumé court (1-2 phrases, max 200 caractères)",
                    },
                    meta_description: {
                      type: "string",
                      description: "Description SEO (max 160 caractères)",
                    },
                    content: {
                      type: "string",
                      description: "Contenu complet en Markdown",
                    },
                  },
                  required: ["title", "excerpt", "meta_description", "content"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "create_blog_post" },
          },
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, retry later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const article = JSON.parse(toolCall.function.arguments);
    const slug = slugify(article.title);

    // Insert into blog_posts
    const { error: insertError } = await supabase.from("blog_posts").insert({
      title: article.title,
      slug,
      excerpt: article.excerpt,
      meta_description: article.meta_description,
      content: article.content,
      category,
      is_published: true,
      published_at: new Date().toISOString(),
      author_name: "NOORIA",
    });

    if (insertError) throw insertError;

    console.log(`✅ Auto-published: "${article.title}" [${category}]`);

    return new Response(
      JSON.stringify({ success: true, title: article.title, category }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("auto-blog error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
