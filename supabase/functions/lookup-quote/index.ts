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

    // Search by ID prefix (first 8 chars of UUID)
    const { data, error } = await supabase
      .from("quote_requests")
      .select("id, created_at, status, city, project_type, annual_consumption, objectif, housing_type, adresse_projet, ville_projet, client_name")
      .ilike("id", `${cleanRef}%`)
      .limit(1)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: "Aucun dossier trouvé avec cette référence" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return limited info (no email/phone for privacy)
    return new Response(
      JSON.stringify({
        id: data.id,
        ref: data.id.slice(0, 8).toUpperCase(),
        created_at: data.created_at,
        status: data.status,
        client_name: data.client_name,
        city: data.ville_projet || data.city,
        project_type: data.project_type,
        housing_type: data.housing_type,
        objectif: data.objectif,
        annual_consumption: data.annual_consumption,
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
