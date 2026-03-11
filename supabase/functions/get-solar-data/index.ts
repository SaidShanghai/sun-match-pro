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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: isLimited } = await supabase.rpc("check_rate_limit", {
      _key: `solar-data:${clientIp}`,
      _max_requests: 30,
      _window_seconds: 3600,
    });
    if (isLimited) {
      return new Response(JSON.stringify({ error: "Rate limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { lat, lng, peakpower } = await req.json();
    if (!lat || !lng) {
      return new Response(JSON.stringify({ error: "lat and lng required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const kWp = peakpower || 1;

    const pvgisUrl = `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=${lat}&lon=${lng}&peakpower=${kWp}&loss=14&optimalangles=1&outputformat=json&raddatabase=PVGIS-SARAH3`;

    const pvgisRes = await fetch(pvgisUrl);

    if (!pvgisRes.ok) {
      const fallbackUrl = `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=${lat}&lon=${lng}&peakpower=${kWp}&loss=14&optimalangles=1&outputformat=json&raddatabase=PVGIS-ERA5`;
      const fallbackRes = await fetch(fallbackUrl);

      if (!fallbackRes.ok) {
        console.error("PVGIS error for coordinates:", lat, lng);
        return new Response(
          JSON.stringify({
            error: "no_coverage",
            message: "Données solaires non disponibles pour cette localisation",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const fallbackData = await fallbackRes.json();
      return new Response(JSON.stringify(formatPvgisData(fallbackData, kWp)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await pvgisRes.json();
    return new Response(JSON.stringify(formatPvgisData(data, kWp)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Solar function error:", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function formatPvgisData(raw: any, peakpower: number) {
  const inputs = raw.inputs || {};
  const outputs = raw.outputs || {};
  const totals = outputs.totals?.fixed || {};
  const monthly = outputs.monthly?.fixed || [];

  const yearlyProductionKwh = totals.E_y || 0;
  const yearlyIrradiationKwhM2 = totals["H(i)_y"] || 0;
  const sdYearly = totals.SD_y || 0;

  const mountingSystem = inputs.mounting_system?.fixed || {};
  const optimalInclination = mountingSystem.slope?.value || 0;
  const optimalAzimuth = mountingSystem.azimuth?.value || 0;

  const location = inputs.location || {};

  const monthlyData = monthly.map((m: any) => ({
    month: m.month,
    productionKwh: m.E_m || 0,
    irradiationKwhM2: m["H(i)_m"] || 0,
    sdMonthly: m.SD_m || 0,
  }));

  const co2SavedKg = Math.round(yearlyProductionKwh * 0.7);
  const savingsMad = Math.round(yearlyProductionKwh * 1.2);

  return {
    source: "PVGIS",
    yearlyProductionKwh: Math.round(yearlyProductionKwh),
    yearlyIrradiationKwhM2: Math.round(yearlyIrradiationKwhM2),
    optimalInclination: Math.round(optimalInclination * 10) / 10,
    optimalAzimuth: Math.round(optimalAzimuth * 10) / 10,
    peakpowerKwp: peakpower,
    systemLoss: 14,
    co2SavedKg,
    savingsMad,
    sdYearly: Math.round(sdYearly),
    monthlyData,
    latitude: location.latitude,
    longitude: location.longitude,
    elevation: location.elevation,
    database: inputs.meteo_data?.radiation_db || "PVGIS-SARAH3",
  };
}
