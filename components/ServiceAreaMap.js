"use client";

import { useEffect, useRef } from "react";

const LIVERPOOL_LAT = 53.4084;
const LIVERPOOL_LNG = -2.9916;
const RADIUS_METRES = 40 * 1609.34; // 40 miles in metres

export default function ServiceAreaMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Load Leaflet JS (no SRI hash - unpkg content changes)
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.crossOrigin = "";

    script.onload = () => {
      // Short delay to ensure mapRef div is rendered and sized
      setTimeout(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const L = window.L;

        const map = L.map(mapRef.current, {
          center: [LIVERPOOL_LAT, LIVERPOOL_LNG],
          zoom: 8,
          scrollWheelZoom: false,
          zoomControl: true,
          attributionControl: true,
        });

        mapInstanceRef.current = map;

        // OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        // 40-mile radius circle
        L.circle([LIVERPOOL_LAT, LIVERPOOL_LNG], {
          radius: RADIUS_METRES,
          color: "#2fb8a7",
          fillColor: "#2fb8a7",
          fillOpacity: 0.1,
          weight: 2,
          dashArray: "8 5",
        }).addTo(map);

        // Branded pin at Liverpool centre
        const icon = L.divIcon({
          html: `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#10b981,#2fb8a7);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(47,184,167,0.55);border:3px solid #fff;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>`,
          className: "",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -42],
        });

        L.marker([LIVERPOOL_LAT, LIVERPOOL_LNG], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;text-align:center;padding:2px">
              <strong style="color:#064e3b;font-size:0.9rem">Green Clean Group</strong><br/>
              <span style="color:#475569;font-size:0.78rem">Liverpool · Up to 40 miles</span>
            </div>`,
            { maxWidth: 180 }
          )
          .openPopup();

        // Town markers within/on the radius
        const towns = [
          { name: "Southport", lat: 53.6451, lng: -3.0067 },
          { name: "Ormskirk",  lat: 53.5673, lng: -2.8770 },
          { name: "Wigan",     lat: 53.5448, lng: -2.6318 },
          { name: "Warrington",lat: 53.3900, lng: -2.5972 },
          { name: "Chester",   lat: 53.1905, lng: -2.8916 },
          { name: "Wirral",    lat: 53.3727, lng: -3.0737 },
          { name: "St Helens", lat: 53.4540, lng: -2.7359 },
        ];

        towns.forEach(({ name, lat, lng }) => {
          L.circleMarker([lat, lng], {
            radius: 5,
            color: "#064e3b",
            fillColor: "#2fb8a7",
            fillOpacity: 0.9,
            weight: 2,
          })
            .addTo(map)
            .bindTooltip(name, {
              permanent: true,
              direction: "top",
              className: "gcg-town-label",
              offset: [0, -6],
            });
        });

        // Force a resize in case the container was hidden during mount
        setTimeout(() => map.invalidateSize(), 100);
      }, 150);
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .gcg-town-label {
          background: rgba(255,255,255,0.96) !important;
          border: 1px solid #6ee7b7 !important;
          border-radius: 5px !important;
          padding: 2px 6px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #064e3b !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
          white-space: nowrap !important;
        }
        .gcg-town-label::before { display: none !important; }
        .leaflet-popup-content-wrapper {
          border-radius: 10px !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "380px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(6,78,59,0.12)",
          border: "1.5px solid #a7f3d0",
          background: "#f0fdf4",
        }}
        aria-label="Interactive map showing Green Clean Group 40-mile service area around Liverpool"
        role="region"
      />
    </>
  );
}
