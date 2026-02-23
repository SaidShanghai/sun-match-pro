/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin } from "lucide-react";
import { cityCoords } from "@/data/moroccanCities";

interface MiniMapMockupProps {
  city: string;
}

const MiniMapMockup = ({ city }: MiniMapMockupProps) => {
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
          zoom: 15,
          mapTypeId: "satellite",
          mapId: "NOORIA_MAP",
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: "greedy",
          keyboardShortcuts: false,
        });

        // Red draggable marker
        const pinEl = document.createElement("div");
        pinEl.style.cssText = "width:24px;height:24px;background:#EF4444;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.5);cursor:grab;touch-action:none;";
        new AdvancedMarkerElement({ map, position: coords, content: pinEl, title: "Votre toit" });

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

  // Update center when city changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      const coords = cityCoords[city] || cityCoords["Casablanca"];
      mapInstanceRef.current.setCenter(coords);
    }
  }, [city]);

  if (error) {
    return (
      <div className="w-full h-[100px] rounded-xl bg-muted flex items-center justify-center">
        <span className="text-[8px] text-muted-foreground">Carte indisponible</span>
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
