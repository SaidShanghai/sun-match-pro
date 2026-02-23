import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { ref } = await req.json();
    if (!ref || typeof ref !== "string" || ref.trim().length < 6) {
      return new Response(
        JSON.stringify({ error: "Référence invalide (min 6 caractères)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanRef = ref.replace(/^#/, "").trim().toLowerCase();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Use raw SQL via rpc since PostgREST can't filter UUID as text with ilike
    const { data, error } = await supabase
      .rpc("lookup_quote_by_ref", { ref_prefix: cleanRef });

    const row = Array.isArray(data) ? data[0] : data;

    if (error || !row) {
      return new Response(
        JSON.stringify({ error: "Aucun dossier trouvé avec cette référence" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return limited info (no email/phone for privacy)
    return new Response(
      JSON.stringify({
        id: row.id,
        ref: String(row.id).slice(0, 8).toUpperCase(),
        created_at: row.created_at,
        status: row.status,
        client_name: row.client_name,
        city: row.ville_projet || row.city,
        project_type: row.project_type,
        housing_type: row.housing_type,
        objectif: row.objectif,
        annual_consumption: row.annual_consumption,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("lookup-quote error:", err);
    return new Response(
      JSON.stringify({ error: "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
