"use client";

import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

interface LocationMapPickerProps {
  label: string;
  value?: { lat: number; lng: number };
  onChange: (location: { lat: number; lng: number }) => void;
  className?: string;
}

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.5rem",
};

// Default center - Tanta, Egypt (your location)
const defaultCenter = {
  lat: 30.7865,
  lng: 31.0004,
};

const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  label,
  value,
  onChange,
  className = "",
}) => {
  const [center, setCenter] = useState(value || defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(value || defaultCenter);
  const [manualLat, setManualLat] = useState(value?.lat.toString() || "");
  const [manualLng, setManualLng] = useState(value?.lng.toString() || "");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Update local state when value prop changes
  useEffect(() => {
    if (value) {
      setCenter(value);
      setMarkerPosition(value);
      setManualLat(value.lat.toFixed(6));
      setManualLng(value.lng.toFixed(6));
    }
  }, [value]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const newPosition = { lat, lng };
        setMarkerPosition(newPosition);
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));
        onChange(newPosition);
      }
    },
    [onChange]
  );

  const handleManualUpdate = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      const newPosition = { lat, lng };
      setMarkerPosition(newPosition);
      setCenter(newPosition);
      onChange(newPosition);
    } else {
      alert(
        "Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)"
      );
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMarkerPosition(newPosition);
        setCenter(newPosition);
        setManualLat(newPosition.lat.toFixed(6));
        setManualLng(newPosition.lng.toFixed(6));
        onChange(newPosition);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to get your current location. ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              "Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
        }

        alert(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle load error
  if (loadError) {
    return (
      <div className={className}>
        <Label className="text-sm font-medium mb-2 block">{label}</Label>
        <div className="w-full h-[300px] bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex flex-col items-center justify-center p-4">
          <p className="text-red-600 dark:text-red-400 text-center font-medium mb-2">
            Failed to load Google Maps
          </p>
          <p className="text-xs text-red-500 dark:text-red-500 text-center">
            Please check your Google Maps API key in .env.local
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Make sure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set correctly
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={className}>
        <Label className="text-sm font-medium mb-2 block">{label}</Label>
        <div className="w-full h-[300px] bg-muted rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Label className="text-sm font-medium mb-2 block">{label}</Label>

      {/* Manual coordinates input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        <Input
          type="number"
          step="any"
          placeholder="Latitude"
          value={manualLat}
          onChange={(e) => setManualLat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleManualUpdate()}
        />
        <Input
          type="number"
          step="any"
          placeholder="Longitude"
          value={manualLng}
          onChange={(e) => setManualLng(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleManualUpdate()}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleManualUpdate}
            className="flex-1"
          >
            Update
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleGetCurrentLocation}
            title="Get current location"
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="border border-border rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onClick={onMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
            gestureHandling: "greedy",
          }}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Click on the map to select a location, or use the location button to get
        your current position
      </p>
    </div>
  );
};

export default LocationMapPicker;
