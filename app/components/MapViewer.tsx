"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- FIX ICON LEAFLET ---
// Leaflet memiliki bug bawaan di Next.js di mana ikon marker tidak muncul. Kode ini memperbaikinya.
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const customIcon = L.icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// --- DEFINISI TIPE PROPS (PENTING) ---
// Kita tambahkan 'popupText?' di sini agar tidak error saat dipanggil
interface MapViewerProps {
  lat: number;
  lng: number;
  popupText?: string; // Tanda tanya (?) berarti opsional (boleh ada, boleh tidak)
}

export default function MapViewer({ lat, lng, popupText }: MapViewerProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Pastikan peta hanya dirender di client-side (browser) untuk menghindari error 'window is not defined'
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 text-sm">
        Memuat Peta...
      </div>
    );
  }

  return (
    <MapContainer 
      center={[lat, lng]} 
      zoom={15} 
      scrollWheelZoom={false} 
      style={{ height: "100%", width: "100%", borderRadius: "1rem", zIndex: 0 }}
    >
      {/* Layer OpenStreetMap (GRATIS) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marker Lokasi */}
      <Marker position={[lat, lng]} icon={customIcon}>
        {/* Tampilkan Popup hanya jika popupText ada */}
        {popupText && (
          <Popup>
            <span className="font-bold text-sm">{popupText}</span>
          </Popup>
        )}
      </Marker>
    </MapContainer>
  );
}