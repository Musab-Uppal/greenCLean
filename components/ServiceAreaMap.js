"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

const LIVERPOOL_LAT = 53.4084;
const LIVERPOOL_LNG = -2.9916;
const RADIUS_METRES = 40 * 1609.34; // 40 miles in metres

export default function ServiceAreaMap({ height = "400px", style = {} }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timerId = null;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current || mapContainerRef.current._leaflet_id) return;

      try {
        const leafletModule = await import("leaflet");
        const L = leafletModule.default || leafletModule;

        if (!isMounted || !mapContainerRef.current) return;

        // Fix default Leaflet icon paths
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const map = L.map(mapContainerRef.current, {
          center: [LIVERPOOL_LAT, LIVERPOOL_LNG],
          zoom: 9,
          scrollWheelZoom: false,
          zoomControl: true,
          attributionControl: true,
        });

        mapInstanceRef.current = map;

        // OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
          maxZoom: 18,
          subdomains: ["a", "b", "c"],
        }).addTo(map);

        // 40-mile service radius circle
        L.circle([LIVERPOOL_LAT, LIVERPOOL_LNG], {
          radius: RADIUS_METRES,
          color: "#059669",
          fillColor: "#10b981",
          fillOpacity: 0.12,
          weight: 2.5,
          dashArray: "6, 6",
        }).addTo(map);

        // Custom Liverpool Pin
        const centerIcon = L.divIcon({
          html: `<div style="position:relative;width:42px;height:42px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:42px;height:42px;border-radius:50%;background:rgba(16,185,129,0.3);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:relative;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#059669,#10b981);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(5,150,105,0.45);border:3px solid #ffffff;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>`,
          className: "",
          iconSize: [42, 42],
          iconAnchor: [21, 38],
          popupAnchor: [0, -40],
        });

        L.marker([LIVERPOOL_LAT, LIVERPOOL_LNG], { icon: centerIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:inherit;text-align:center;padding:4px">
              <strong style="color:#064e3b;font-size:0.92rem;display:block;margin-bottom:2px">Green Clean Group HQ</strong>
              <span style="color:#059669;font-weight:700;font-size:0.8rem">Liverpool City Centre</span><br/>
              <span style="color:#475569;font-size:0.75rem">Covering Liverpool &amp; 40-mile radius</span>
            </div>`,
            { maxWidth: 220 }
          );

        // Key town markers within the 40-mile coverage zone
        const towns = [
          { name: "Southport", lat: 53.6451, lng: -3.0067 },
          { name: "Ormskirk", lat: 53.5673, lng: -2.877 },
          { name: "Wigan", lat: 53.5448, lng: -2.6318 },
          { name: "Warrington", lat: 53.39, lng: -2.5972 },
          { name: "Chester", lat: 53.1905, lng: -2.8916 },
          { name: "Wirral", lat: 53.3727, lng: -3.0737 },
          { name: "St Helens", lat: 53.454, lng: -2.7359 },
          { name: "Widnes / Runcorn", lat: 53.3644, lng: -2.7297 },
        ];

        towns.forEach(({ name, lat, lng }) => {
          L.circleMarker([lat, lng], {
            radius: 5,
            color: "#064e3b",
            fillColor: "#10b981",
            fillOpacity: 0.95,
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

        timerId = setTimeout(() => {
          if (isMounted && mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
            setMapLoaded(true);
          }
        }, 150);
      } catch (err) {
        console.error("[ServiceAreaMap] Leaflet initialization error:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden", ...style }}>
      <style>{`
        .gcg-town-label {
          background: rgba(255,255,255,0.96) !important;
          border: 1px solid #6ee7b7 !important;
          border-radius: 5px !important;
          padding: 2px 7px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #064e3b !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12) !important;
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

      {/* Map Header / Legend Overlay */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(8px)",
          padding: "8px 14px",
          borderRadius: "10px",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#10b981",
            border: "2px solid #059669",
          }}
        />
        <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#064e3b" }}>
          40-Mile Service Coverage Zone
        </span>
      </div>

      {/* Interactive Map DOM node */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: height,
          background: "#ecfdf5",
          border: "1.5px solid #a7f3d0",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(6, 78, 59, 0.08)",
        }}
        aria-label="Interactive map showing Green Clean Group 40-mile service coverage around Liverpool"
        role="region"
      />
    </div>
  );
}
