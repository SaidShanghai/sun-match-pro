/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Plus, Minus, CheckCircle2 } from "lucide-react";
import { cityCoords } from "@/data/moroccanCities";

interface MiniMapMockupProps {
  city: string;
  fullscreen?: boolean;
  onValidate?: () => void;
}

const MiniMapMockup = ({ city, fullscreen = false, onValidate }: MiniMapMockupProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const initedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initedRef.current || !mapRef.current) return;
    initedRef.current = true;

    (async () => {
      try {
        let apiKey = sessionStorage.getItem("gm_key");
        if (!apiKey) {
          const { data } = await supabase.functions.invoke("get-maps-key");
          if (!data?.key) { setError(true); setLoading(false); return; }
          apiKey = data.key;
          sessionStorage.setItem("gm_key", apiKey!);
        }

        if (!(window as any).google?.maps) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.head.appendChild(script);
          });
        }

        const coords = cityCoords[city] || cityCoords["Casablanca"];
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        const map = new google.maps.Map(mapRef.current!, {
          center: coords,
          zoom: fullscreen ? 17 : 15,
          mapTypeId: "satellite",
          mapId: "NOORIA_MAP",
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: "greedy",
          keyboardShortcuts: false,
        });

        // Red draggable marker
        const pinEl = document.createElement("div");
        pinEl.style.cssText = `width:${fullscreen ? 32 : 24}px;height:${fullscreen ? 32 : 24}px;background:#EF4444;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.5);cursor:grab;touch-action:none;`;
        new AdvancedMarkerElement({ map, position: coords, gmpDraggable: fullscreen, content: pinEl, title: "Votre toit" });

        // Blue geolocation dot
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const geoPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              const dot = document.createElement("div");
              dot.style.cssText = "width:12px;height:12px;background:#4285F4;border:2px solid white;border-radius:50%;box-shadow:0 0 4px rgba(66,133,244,0.6);";
              new AdvancedMarkerElement({ map, position: geoPos, content: dot, title: "Votre position" });
            },
            () => {},
            { enableHighAccuracy: true, timeout: 8000 }
          );
        }

        mapInstanceRef.current = map;
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      const coords = cityCoords[city] || cityCoords["Casablanca"];
      mapInstanceRef.current.setCenter(coords);
    }
  }, [city]);

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      const current = mapInstanceRef.current.getZoom() || 15;
      mapInstanceRef.current.setZoom(current + delta);
    }
  };

  if (error) {
    return (
      <div className={`w-full ${fullscreen ? "h-full" : "h-[100px]"} rounded-xl bg-muted flex items-center justify-center`}>
        <span className="text-[8px] text-muted-foreground">Carte indisponible</span>
      </div>
    );
  }

  if (fullscreen) {
    return (
      <div className="w-full relative" style={{ touchAction: "none", height: "100%", minHeight: "500px" }}>
        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-muted/60">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        {/* Map fills entire space */}
        <div ref={mapRef} className="absolute inset-0" style={{ touchAction: "none" }} />

        {/* Top bar overlay */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-2 px-3 py-2 bg-gradient-to-b from-black/60 to-transparent">
          <MapPin className="w-3.5 h-3.5 text-white" />
          <span className="text-[10px] font-semibold text-white">{city || "Casablanca"}, Maroc</span>
        </div>

        {/* Instruction overlay */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
          <p className="text-[8px] text-white font-medium">Déplacez le marqueur rouge sur votre toit</p>
        </div>

        {/* Zoom controls */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5">
          <button
            onClick={() => handleZoom(1)}
            className="w-8 h-8 rounded-lg bg-background/90 backdrop-blur-sm border border-border shadow-md flex items-center justify-center hover:bg-background transition-colors"
          >
            <Plus className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => handleZoom(-1)}
            className="w-8 h-8 rounded-lg bg-background/90 backdrop-blur-sm border border-border shadow-md flex items-center justify-center hover:bg-background transition-colors"
          >
            <Minus className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Validate button */}
        <div className="absolute bottom-4 left-4 right-4 z-30">
          <button
            onClick={onValidate}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-lg hover:bg-primary/90 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Valider ma position
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border relative" style={{ touchAction: "none" }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/60">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-[100px]" style={{ touchAction: "none" }} />
      <div className="flex items-center gap-1 px-2 py-1 bg-muted/50">
        <MapPin className="w-2.5 h-2.5 text-primary" />
        <span className="text-[8px] text-muted-foreground">{city || "Casablanca"}, Maroc</span>
      </div>
    </div>
  );
};

export default MiniMapMockup;
