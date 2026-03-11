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

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: isLimited } = await supabase.rpc("check_rate_limit", {
      _key: `lookup-quote:${clientIp}`,
      _max_requests: 20,
      _window_seconds: 3600,
    });
    if (isLimited) {
      return new Response(JSON.stringify({ error: "Trop de requêtes. Réessayez plus tard." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { ref } = await req.json();
    if (!ref || typeof ref !== "string" || ref.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Référence invalide (min 10 caractères)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanRef = ref.replace(/^#/, "").trim().toLowerCase();

    const { data, error } = await supabase
      .rpc("lookup_quote_by_ref", { ref_prefix: cleanRef });

    const row = Array.isArray(data) ? data[0] : data;

    if (error || !row) {
      return new Response(
        JSON.stringify({ error: "Aucun dossier trouvé avec cette référence" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        ref: String(row.id).slice(0, 12).toUpperCase(),
        created_at: row.created_at,
        status: row.status,
        city: row.ville_projet || row.city,
        housing_type: row.housing_type,
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
