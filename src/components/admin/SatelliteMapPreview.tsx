import { useEffect, useRef } from "react";

interface SatelliteMapPreviewProps {
  lat: number;
  lng: number;
  apiKey: string;
}

const SatelliteMapPreview = ({ lat, lng, apiKey }: SatelliteMapPreviewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const position = { lat, lng };

      const map = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: 19,
        mapTypeId: "satellite",
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        styles: [
          // Hide all labels to avoid any political borders/names
          { elementType: "labels", stylers: [{ visibility: "off" }] },
        ],
      });

      new google.maps.Marker({
        position,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      mapInstanceRef.current = map;
    };

    // Load Google Maps script if not already loaded
    if (window.google?.maps) {
      initMap();
      return;
    }

    const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
    if (existingScript) {
      existingScript.addEventListener("load", initMap);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      mapInstanceRef.current = null;
    };
  }, [lat, lng, apiKey]);

  return <div ref={mapRef} className="w-full h-[300px] bg-muted" />;
};

export default SatelliteMapPreview;
