import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng, peakpower } = await req.json();
    if (!lat || !lng) {
      return new Response(JSON.stringify({ error: "lat and lng required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use 1 kWp as reference to get per-kWp production data
    const kWp = peakpower || 1;

    // PVGIS API - PVcalc endpoint (free, no API key, covers Morocco/Africa via PVGIS-SARAH3)
    const pvgisUrl = `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=${lat}&lon=${lng}&peakpower=${kWp}&loss=14&optimalangles=1&outputformat=json&raddatabase=PVGIS-SARAH3`;

    console.log("Calling PVGIS:", pvgisUrl);
    const pvgisRes = await fetch(pvgisUrl);

    if (!pvgisRes.ok) {
      // Try with ERA5 database as fallback (global coverage)
      const fallbackUrl = `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=${lat}&lon=${lng}&peakpower=${kWp}&loss=14&optimalangles=1&outputformat=json&raddatabase=PVGIS-ERA5`;
      console.log("SARAH3 failed, trying ERA5:", fallbackUrl);
      const fallbackRes = await fetch(fallbackUrl);

      if (!fallbackRes.ok) {
        const errText = await fallbackRes.text();
        console.error("PVGIS error:", errText);
        return new Response(
          JSON.stringify({
            error: "no_coverage",
            message: "Données solaires non disponibles pour cette localisation",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
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
      JSON.stringify({ error: "internal_error", message: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function formatPvgisData(raw: any, peakpower: number) {
  const inputs = raw.inputs || {};
  const outputs = raw.outputs || {};
  const totals = outputs.totals?.fixed || {};
  const monthly = outputs.monthly?.fixed || [];

  // E_y = yearly PV energy production (kWh)
  const yearlyProductionKwh = totals.E_y || 0;
  // H(i)_y = yearly in-plane irradiation (kWh/m²)
  const yearlyIrradiationKwhM2 = totals["H(i)_y"] || 0;
  // SD_y = standard deviation of yearly production
  const sdYearly = totals.SD_y || 0;

  // Optimal angles
  const mountingSystem = inputs.mounting_system?.fixed || {};
  const optimalInclination = mountingSystem.slope?.value || 0;
  const optimalAzimuth = mountingSystem.azimuth?.value || 0;

  // Location info
  const location = inputs.location || {};

  // Monthly breakdown
  const monthlyData = monthly.map((m: any) => ({
    month: m.month,
    productionKwh: m.E_m || 0,
    irradiationKwhM2: m["H(i)_m"] || 0,
    sdMonthly: m.SD_m || 0,
  }));

  // Estimate sunshine hours from irradiation (rough: GHI / average solar constant ~1 kW/m²)
  const estimatedSunshineHours = yearlyIrradiationKwhM2;

  // CO2 savings: Morocco grid ~0.7 kg CO2/kWh
  const co2SavedKg = Math.round(yearlyProductionKwh * 0.7);

  // Electricity price Morocco ~1.2 MAD/kWh
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
