import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, fileType, fileName, quoteRef, clientName, clientEmail } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Decode base64 and upload with service role (bypasses RLS)
    const base64Data = fileBase64.split(",")[1] ?? fileBase64;
    const fileBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const ext = fileName.split(".").pop() ?? "pdf";
    const filePath = `${quoteRef}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("client-invoices")
      .upload(filePath, fileBytes, { contentType: fileType, upsert: true });

    if (uploadError) throw uploadError;

    // Generate a signed URL valid for 7 days
    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from("client-invoices")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);

    if (signedError) throw signedError;

    const signedUrl = signedData.signedUrl;

    // Send email via Resend (best-effort)
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "NOORIA <noreply@sungpt.ma>",
          to: ["contact@sungpt.ma"],
          subject: `📄 Nouvelle facture — ${clientName} (Réf. #${quoteRef})`,
          html: `
            <h2>Nouvelle facture téléversée</h2>
            <p><strong>Client :</strong> ${clientName}</p>
            <p><strong>Email :</strong> ${clientEmail}</p>
            <p><strong>Référence :</strong> #${quoteRef}</p>
            <p><strong>Fichier :</strong> ${fileName}</p>
            <br/>
            <p>
              <a href="${signedUrl}" style="background:#f97316;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
                📥 Télécharger la facture
              </a>
            </p>
            <p style="color:#888;font-size:12px;">Ce lien expire dans 7 jours.</p>
          `,
        }),
      }).catch(() => {/* email optional */});
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
