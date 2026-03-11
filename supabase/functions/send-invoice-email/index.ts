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

/** Escape HTML special characters to prevent XSS in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: isLimited } = await supabaseAdmin.rpc("check_rate_limit", {
      _key: `send-invoice:${clientIp}`,
      _max_requests: 5,
      _window_seconds: 3600,
    });

    if (isLimited) {
      return new Response(
        JSON.stringify({ error: "Trop de requêtes. Réessayez dans une heure." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { fileBase64, fileType, fileName, quoteRef, clientName, clientEmail } = await req.json();

    if (!fileBase64 || !fileName || !quoteRef || !clientName || !clientEmail) {
      return new Response(
        JSON.stringify({ error: "Champs obligatoires manquants." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ext = String(fileName).split(".").pop()?.toLowerCase();
    if (ext !== "pdf" || (fileType && !fileType.includes("pdf"))) {
      return new Response(
        JSON.stringify({ error: "Seuls les fichiers PDF sont acceptés." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const base64Data = String(fileBase64).split(",")[1] ?? String(fileBase64);
    const fileBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    if (fileBytes.length > MAX_FILE_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: "Le fichier dépasse la taille maximale de 2 Mo." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (
      fileBytes.length < 5 ||
      fileBytes[0] !== 0x25 ||
      fileBytes[1] !== 0x50 ||
      fileBytes[2] !== 0x44 ||
      fileBytes[3] !== 0x46 ||
      fileBytes[4] !== 0x2d
    ) {
      return new Response(
        JSON.stringify({ error: "Le fichier n'est pas un PDF valide." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedRef = String(quoteRef).replace(/[^a-zA-Z0-9-]/g, "").slice(0, 20);
    const filePath = `${sanitizedRef}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("client-invoices")
      .upload(filePath, fileBytes, { contentType: "application/pdf", upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from("client-invoices")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);

    if (signedError) {
      console.error("Signed URL error:", signedError);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const signedUrl = signedData.signedUrl;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const safeName = escapeHtml(String(clientName).trim().slice(0, 100));
      const safeEmail = escapeHtml(String(clientEmail).trim().slice(0, 255));
      const safeRef = escapeHtml(sanitizedRef || "N/A");
      const safeFileName = escapeHtml(String(fileName).slice(0, 100));

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "NOORIA <noreply@sungpt.ma>",
          to: ["contact@sungpt.ma"],
          subject: `📄 Nouvelle facture — ${safeName} (Réf. #${safeRef})`,
          html: `
            <h2>Nouvelle facture téléversée</h2>
            <p><strong>Client :</strong> ${safeName}</p>
            <p><strong>Email :</strong> ${safeEmail}</p>
            <p><strong>Référence :</strong> #${safeRef}</p>
            <p><strong>Fichier :</strong> ${safeFileName}</p>
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
    console.error("send-invoice-email error:", error instanceof Error ? error.message : error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
