/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Loader2 } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const AddressAutocomplete = ({ value, onChange, placeholder = "N°, Rue" }: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const initedRef = useRef(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initedRef.current || !inputRef.current) return;
    initedRef.current = true;

    (async () => {
      try {
        // If Google Maps not loaded yet, load it
        if (!(window as any).google?.maps?.places) {
          setLoading(true);
          if (!(window as any).google?.maps) {
            const { data, error } = await supabase.functions.invoke("get-maps-key");
            if (error || !data?.key) {
              setLoading(false);
              return;
            }
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement("script");
              script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&libraries=marker,places`;
              script.async = true;
              script.onload = () => resolve();
              script.onerror = () => reject();
              document.head.appendChild(script);
            });
          }
          setLoading(false);
        }

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
          componentRestrictions: { country: "ma" },
          types: ["address"],
          fields: ["formatted_address", "address_components"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place?.formatted_address) {
            onChange(place.formatted_address);
          }
        });

        autocompleteRef.current = autocomplete;
      } catch (e) {
        console.error("Autocomplete init error:", e);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-2 border-border rounded-xl focus-within:border-primary transition-colors">
      <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : null}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
      />
    </div>
  );
};

export default AddressAutocomplete;
