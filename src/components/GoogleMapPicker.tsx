/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin } from "lucide-react";
import { cityCoords } from "@/data/moroccanCities";

interface GoogleMapPickerProps {
  city: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

const GoogleMapPicker = ({ city, onLocationSelect }: GoogleMapPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const geoMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const onLocationSelectRef = useRef(onLocationSelect);
  const initedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep callback ref up to date without triggering re-renders
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Init map only once
  useEffect(() => {
    if (initedRef.current || !mapRef.current) return;
    initedRef.current = true;

    (async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("get-maps-key");
        if (fnError || !data?.key) {
          setError("Impossible de charger la carte");
          setLoading(false);
          return;
        }

        // Load Google Maps script if not already loaded
        if (!(window as any).google?.maps) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&libraries=marker,places`;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Google Maps"));
            document.head.appendChild(script);
          });
        }

        const coords = cityCoords[city] || cityCoords["Casablanca"];

        const map = new google.maps.Map(mapRef.current!, {
          center: coords,
          zoom: 18,
          mapTypeId: "satellite",
          mapId: "NOORIA_MAP",
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: [
            { elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        });

        // Custom large marker for easy mobile dragging
        const pinEl = document.createElement("div");
        pinEl.style.cssText = "width:40px;height:40px;background:#EF4444;border:4px solid white;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,0.5);cursor:grab;touch-action:none;";

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: coords,
          gmpDraggable: true,
          title: "Déplacez vers votre toit",
          content: pinEl,
        });

        marker.addListener("dragend", () => {
          const pos = marker.position;
          if (pos && typeof pos === "object" && "lat" in pos && "lng" in pos) {
            onLocationSelectRef.current?.(pos.lat as number, pos.lng as number);
          }
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        onLocationSelectRef.current?.(coords.lat, coords.lng);
        setLoading(false);

        // Try geolocation for blue dot
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const geoPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              const dot = document.createElement("div");
              dot.style.cssText = "width:16px;height:16px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 0 6px rgba(66,133,244,0.6);";

              const geoMarker = new google.maps.marker.AdvancedMarkerElement({
                map,
                position: geoPos,
                content: dot,
                title: "Votre position",
              });
              geoMarkerRef.current = geoMarker;

              map.setCenter(geoPos);
              marker.position = geoPos;
              onLocationSelectRef.current?.(geoPos.lat, geoPos.lng);
            },
            () => { /* silently ignore */ },
            { enableHighAccuracy: true, timeout: 8000 }
          );
        }
      } catch (e) {
        console.error("Map init error:", e);
        setError("Erreur lors du chargement de la carte");
        setLoading(false);
      }
    })();
  }, []); // Run once only

  // Update map center when city changes (after init)
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const coords = cityCoords[city] || cityCoords["Casablanca"];
      mapInstanceRef.current.setCenter(coords);
      markerRef.current.position = coords;
      onLocationSelectRef.current?.(coords.lat, coords.lng);
    }
  }, [city]);

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        <MapPin className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        Localisez votre toit
      </label>
      <p className="text-xs text-muted-foreground">Déplacez le marqueur ROUGE au centre de votre toiture</p>
      <div className="relative rounded-xl overflow-hidden border-2 border-border touch-none">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/60">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        <div ref={mapRef} className="w-full h-[350px] md:h-[400px]" style={{ touchAction: "none" }} />
      </div>
    </div>
  );
};

export default GoogleMapPicker;
