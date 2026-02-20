import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
};

// Rate limiting: IP -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

// Max file size: 2 MB
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Trop de requêtes. Réessayez dans une heure." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { fileBase64, fileType, fileName, quoteRef, clientName, clientEmail } = await req.json();

    // Validate required fields
    if (!fileBase64 || !fileName || !quoteRef || !clientName || !clientEmail) {
      return new Response(
        JSON.stringify({ error: "Champs obligatoires manquants." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file type: PDF only
    const ext = String(fileName).split(".").pop()?.toLowerCase();
    if (ext !== "pdf" || (fileType && !fileType.includes("pdf"))) {
      return new Response(
        JSON.stringify({ error: "Seuls les fichiers PDF sont acceptés." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decode base64 and validate file size
    const base64Data = String(fileBase64).split(",")[1] ?? String(fileBase64);
    const fileBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    if (fileBytes.length > MAX_FILE_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: "Le fichier dépasse la taille maximale de 2 Mo." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate PDF magic bytes (%PDF-)
    if (
      fileBytes.length < 5 ||
      fileBytes[0] !== 0x25 || // %
      fileBytes[1] !== 0x50 || // P
      fileBytes[2] !== 0x44 || // D
      fileBytes[3] !== 0x46 || // F
      fileBytes[4] !== 0x2d    // -
    ) {
      return new Response(
        JSON.stringify({ error: "Le fichier n'est pas un PDF valide." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const sanitizedRef = String(quoteRef).replace(/[^a-zA-Z0-9-]/g, "").slice(0, 20);
    const filePath = `${sanitizedRef}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("client-invoices")
      .upload(filePath, fileBytes, { contentType: "application/pdf", upsert: true });

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
      const safeName = String(clientName).trim().slice(0, 100);
      const safeEmail = String(clientEmail).trim().slice(0, 255);
      const safeRef = sanitizedRef || "N/A";

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
            <p><strong>Fichier :</strong> ${String(fileName).slice(0, 100)}</p>
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
