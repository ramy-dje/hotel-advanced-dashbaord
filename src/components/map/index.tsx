import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Fix Leaflet's default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface Coordinates {
  lat: number;
  lng: number;
}
interface MapPinSelectorProps {
  coordinatesList: Coordinates[];
  onMapClick?: (coords: Coordinates) => void;
  height?: string;
  zoom?: number;
}
interface MapPinSelectorState {
  coordinatesList: Coordinates[];
}

const MapPinSelector: React.FC<MapPinSelectorProps> = ({
  coordinatesList,
  onMapClick,
  height = "300px",
  zoom = 14,
}) => {
  const center: Coordinates = coordinatesList.length > 0 ? coordinatesList[0] : { lat: 36.75, lng: 3.06 };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
        onMapClick?.(coords);
      },
    });
    return null;
  };

  return (
    <div style={{ width: "100%", height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {coordinatesList.map((coord, idx) => (
          <Marker key={idx} position={coord} />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPinSelector;