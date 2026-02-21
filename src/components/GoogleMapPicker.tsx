/// <reference types="google.maps" />
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin } from "lucide-react";

interface GoogleMapPickerProps {
  city: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

// City coordinates for Morocco
const cityCoords: Record<string, { lat: number; lng: number }> = {
  "Casablanca": { lat: 33.5731, lng: -7.5898 },
  "Rabat": { lat: 34.0209, lng: -6.8416 },
  "Marrakech": { lat: 31.6295, lng: -7.9811 },
  "Fès": { lat: 34.0331, lng: -5.0003 },
  "Tanger": { lat: 35.7595, lng: -5.8340 },
  "Agadir": { lat: 30.4278, lng: -9.5981 },
  "Meknès": { lat: 33.8935, lng: -5.5473 },
  "Oujda": { lat: 34.6814, lng: -1.9086 },
  "Kénitra": { lat: 34.2610, lng: -6.5802 },
  "Tétouan": { lat: 35.5889, lng: -5.3626 },
  "Safi": { lat: 32.2994, lng: -9.2372 },
  "El Jadida": { lat: 33.2316, lng: -8.5007 },
  "Nador": { lat: 35.1688, lng: -2.9287 },
  "Béni Mellal": { lat: 32.3373, lng: -6.3498 },
  "Mohammedia": { lat: 33.6861, lng: -7.3830 },
};

const GoogleMapPicker = ({ city, onLocationSelect }: GoogleMapPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initMap = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      // Fetch API key
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
          script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&libraries=marker`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Google Maps"));
          document.head.appendChild(script);
        });
      }

      const coords = cityCoords[city] || cityCoords["Casablanca"];

      const map = new google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 18,
        mapTypeId: "satellite",
        mapId: "NOORIA_MAP",
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
      });

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: coords,
        gmpDraggable: true,
        title: "Déplacez vers votre toit",
      });

      marker.addListener("dragend", () => {
        const pos = marker.position;
        if (pos && typeof pos === 'object' && 'lat' in pos && 'lng' in pos) {
          onLocationSelect?.(pos.lat as number, pos.lng as number);
        }
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      onLocationSelect?.(coords.lat, coords.lng);
      setLoading(false);
    } catch (e) {
      console.error("Map init error:", e);
      setError("Erreur lors du chargement de la carte");
      setLoading(false);
    }
  }, [city, onLocationSelect]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  // Update map center when city changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const coords = cityCoords[city] || cityCoords["Casablanca"];
      mapInstanceRef.current.setCenter(coords);
      markerRef.current.position = coords;
      onLocationSelect?.(coords.lat, coords.lng);
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
      <p className="text-xs text-muted-foreground">Déplacez le marqueur au centre de votre toiture</p>
      <div className="relative rounded-xl overflow-hidden border-2 border-border">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/60">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        <div ref={mapRef} className="w-full h-[280px] md:h-[350px]" />
      </div>
    </div>
  );
};

export default GoogleMapPicker;
