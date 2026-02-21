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
    const { lat, lng } = await req.json();
    if (!lat || !lng) {
      return new Response(JSON.stringify({ error: "lat and lng required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Google Solar API - Building Insights endpoint
    const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${apiKey}`;

    const solarRes = await fetch(solarUrl);

    if (!solarRes.ok) {
      // If HIGH quality not available, try MEDIUM
      const solarUrlMedium = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=MEDIUM&key=${apiKey}`;
      const solarResMedium = await fetch(solarUrlMedium);

      if (!solarResMedium.ok) {
        // Try LOW quality as last resort
        const solarUrlLow = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=LOW&key=${apiKey}`;
        const solarResLow = await fetch(solarUrlLow);

        if (!solarResLow.ok) {
          const errText = await solarResLow.text();
          console.error("Solar API error:", errText);
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

        const dataLow = await solarResLow.json();
        return new Response(JSON.stringify(formatSolarData(dataLow)), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const dataMedium = await solarResMedium.json();
      return new Response(JSON.stringify(formatSolarData(dataMedium)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await solarRes.json();
    return new Response(JSON.stringify(formatSolarData(data)), {
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

function formatSolarData(raw: any) {
  const solar = raw.solarPotential;
  if (!solar) {
    return { error: "no_data", message: "Pas de données solaires disponibles" };
  }

  // Get the best solar panel config (max panels)
  const configs = solar.solarPanelConfigs || [];
  const bestConfig = configs.length > 0 ? configs[configs.length - 1] : null;
  const midConfig =
    configs.length > 2
      ? configs[Math.floor(configs.length / 2)]
      : bestConfig;

  // Roof segments info
  const roofSegments = solar.roofSegmentStats || [];
  const totalArea = roofSegments.reduce(
    (sum: number, seg: any) => sum + (seg.stats?.areaMeters2 || 0),
    0
  );

  // Financial analysis (if available)
  const financialAnalyses = solar.financialAnalyses || {};
  const monthlyBill = financialAnalyses.monthlyBill;

  // Sun hours
  const maxSunHours = solar.maxSunshineHoursPerYear || 0;

  // Carbon offset
  const carbonOffset = solar.carbonOffsetFactorKgPerMwh || 0;

  return {
    maxSunshineHoursPerYear: maxSunHours,
    maxArrayAreaMeters2: solar.maxArrayAreaMeters2 || 0,
    maxArrayPanelsCount: solar.maxArrayPanelsCount || 0,
    totalRoofAreaMeters2: totalArea,
    panelCapacityWatts: solar.panelCapacityWatts || 400,
    panelHeightMeters: solar.panelHeightMeters,
    panelWidthMeters: solar.panelWidthMeters,
    carbonOffsetFactorKgPerMwh: carbonOffset,
    roofSegmentCount: roofSegments.length,
    imageryDate: raw.imageryDate,
    imageryQuality: raw.imageryQuality,
    // Best config
    bestConfig: bestConfig
      ? {
          panelsCount: bestConfig.panelsCount,
          yearlyEnergyDcKwh: bestConfig.yearlyEnergyDcKwh,
        }
      : null,
    // Mid config (recommended)
    recommendedConfig: midConfig
      ? {
          panelsCount: midConfig.panelsCount,
          yearlyEnergyDcKwh: midConfig.yearlyEnergyDcKwh,
        }
      : null,
    // Roof segments summary
    roofSegments: roofSegments.slice(0, 4).map((seg: any) => ({
      pitchDegrees: seg.pitchDegrees,
      azimuthDegrees: seg.azimuthDegrees,
      areaMeters2: seg.stats?.areaMeters2 || 0,
      sunshineHoursPerYear: seg.stats?.sunshineQuantiles
        ? seg.stats.sunshineQuantiles[
            seg.stats.sunshineQuantiles.length - 1
          ]
        : 0,
    })),
    // Data layer URLs for visualization
    dataLayerUrls: solar.dataLayers
      ? {
          rgbUrl: solar.dataLayers.rgbUrl,
          maskUrl: solar.dataLayers.maskUrl,
          annualFluxUrl: solar.dataLayers.annualFluxUrl,
          monthlyFluxUrl: solar.dataLayers.monthlyFluxUrl,
        }
      : null,
  };
}
