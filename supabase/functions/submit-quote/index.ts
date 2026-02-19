import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { client_name, client_email, client_phone, city } = await req.json();

    if (!client_name || !client_email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        client_name: String(client_name).trim().slice(0, 100),
        client_email: String(client_email).trim().slice(0, 255),
        client_phone: client_phone ? String(client_phone).trim().slice(0, 20) : null,
        city: city ? String(city).trim().slice(0, 100) : null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) throw error;

    // Send confirmation email to client (best-effort)
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const firstName = String(client_name).trim().split(" ")[0];
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "NOORIA <noreply@sungpt.ma>",
          to: [String(client_email).trim()],
          subject: "✅ Votre demande NOORIA a bien été reçue",
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#fff;border-radius:12px;">
              <div style="text-align:center;margin-bottom:24px;">
                <img src="https://sungpt.ma/logo.png" alt="NOORIA" style="height:48px;" onerror="this.style.display='none'" />
                <h1 style="color:#f97316;font-size:22px;margin-top:12px;">NOORIA – Énergie Solaire</h1>
              </div>

              <p style="font-size:16px;color:#333;">Bonjour <strong>${firstName}</strong>,</p>

              <p style="font-size:15px;color:#444;line-height:1.6;">
                Nous avons bien reçu votre demande et notre équipe est en train d'analyser votre profil pour vous proposer la solution solaire la mieux adaptée à vos besoins.
              </p>

              <div style="background:#fff7ed;border-left:4px solid #f97316;padding:16px 20px;border-radius:8px;margin:24px 0;">
                <p style="margin:0;font-size:14px;color:#92400e;font-weight:600;">⏱ Délai de traitement</p>
                <p style="margin:4px 0 0;font-size:14px;color:#78350f;">Un conseiller vous contactera sous <strong>24h</strong> pour vous présenter votre devis personnalisé.</p>
              </div>

              <p style="font-size:14px;color:#666;line-height:1.6;">
                En attendant, si vous avez des questions, n'hésitez pas à nous contacter à 
                <a href="mailto:contact@sungpt.ma" style="color:#f97316;">contact@sungpt.ma</a>.
              </p>

              <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />

              <p style="font-size:12px;color:#aaa;text-align:center;">
                NOORIA – Votre partenaire solaire au Maroc<br/>
                <a href="https://sungpt.ma" style="color:#f97316;">sungpt.ma</a>
              </p>
            </div>
          `,
        }),
      }).catch((e) => console.error("Email to client failed:", e));
    }

    return new Response(JSON.stringify({ id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-quote error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
