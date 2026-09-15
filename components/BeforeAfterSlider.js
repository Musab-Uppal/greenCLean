"use client";

import React, { useState, useRef, useCallback } from "react";
import { Sparkles, MoveHorizontal, CheckCircle2 } from "lucide-react";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 5) percentage = 5;
    if (percentage > 95) percentage = 95;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div style={{ position: "relative" }}>
      <div 
        ref={containerRef}
        className="ba-slider-container"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        onClick={(e) => handleMove(e.clientX)}
        role="region"
        aria-label="Interactive before and after comparison"
      >
        {/* AFTER Layer (Full width in background) */}
        <div 
          className="ba-image-layer"
          style={{
            background: "linear-gradient(135deg, #022c22 0%, #064e3b 40%, #0f766e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          {/* Gleaming Clean Oven Illustration / Art */}
          <div style={{ 
            width: "85%", 
            height: "80%", 
            borderRadius: "16px", 
            border: "4px solid #10b981", 
            background: "radial-gradient(circle at 50% 50%, #065f46 0%, #022c22 100%)",
            boxShadow: "0 0 40px rgba(16, 185, 129, 0.4), inset 0 0 30px rgba(52, 211, 153, 0.2)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px"
          }}>
            {/* Sparkle highlights */}
            <div style={{ position: "absolute", top: "20%", right: "25%", color: "#6ee7b7", animation: "pulseGlow 2s infinite" }}>
              <Sparkles size={32} />
            </div>
            <div style={{ position: "absolute", bottom: "25%", left: "30%", color: "#34d399" }}>
              <Sparkles size={24} />
            </div>

            {/* Pristine Chrome Racks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "20px" }}>
              <div style={{ height: "6px", width: "100%", background: "linear-gradient(90deg, #94a3b8, #f8fafc, #94a3b8)", borderRadius: "4px", boxShadow: "0 2px 8px rgba(255,255,255,0.6)" }} />
              <div style={{ height: "6px", width: "100%", background: "linear-gradient(90deg, #94a3b8, #f8fafc, #94a3b8)", borderRadius: "4px", boxShadow: "0 2px 8px rgba(255,255,255,0.6)" }} />
              <div style={{ height: "6px", width: "100%", background: "linear-gradient(90deg, #94a3b8, #f8fafc, #94a3b8)", borderRadius: "4px", boxShadow: "0 2px 8px rgba(255,255,255,0.6)" }} />
            </div>

            <div style={{ textAlign: "right", color: "#a7f3d0", fontWeight: "700", fontSize: "0.95rem" }}>
              ✨ 100% Non-Toxic Dipping Tank Result
            </div>
          </div>

          <span className="ba-badge ba-badge-after">After: Spotless &amp; Fresh</span>
        </div>

        {/* BEFORE Layer (Clipped by slider position) */}
        <div 
          className="ba-image-layer"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            background: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          {/* Dirty Greasy Burnt Oven Illustration */}
          <div style={{ 
            width: "85%", 
            height: "80%", 
            borderRadius: "16px", 
            border: "4px solid #78716c", 
            background: "radial-gradient(circle at 40% 40%, #451a03 0%, #1c1917 100%)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px",
            filter: "contrast(1.2)"
          }}>
            {/* Burnt grease textures */}
            <div style={{ position: "absolute", top: "15%", left: "15%", width: "140px", height: "80px", background: "rgba(120, 53, 15, 0.8)", borderRadius: "60% 40% 70% 30%", filter: "blur(8px)" }} />
            <div style={{ position: "absolute", bottom: "20%", right: "20%", width: "180px", height: "100px", background: "rgba(69, 26, 3, 0.9)", borderRadius: "40% 60% 30% 70%", filter: "blur(12px)" }} />

            {/* Burnt Racks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "20px", opacity: "0.5" }}>
              <div style={{ height: "6px", width: "100%", background: "#44403c", borderRadius: "4px" }} />
              <div style={{ height: "6px", width: "100%", background: "#292524", borderRadius: "4px" }} />
              <div style={{ height: "6px", width: "100%", background: "#44403c", borderRadius: "4px" }} />
            </div>

            <div style={{ textAlign: "left", color: "#fca5a5", fontWeight: "700", fontSize: "0.95rem" }}>
              ⚠️ Heavy Baked-on Carbon &amp; Grease
            </div>
          </div>

          <span className="ba-badge ba-badge-before">Before: Burnt-On Grease</span>
        </div>

        {/* Draggable Divider Handle */}
        <div 
          className="ba-handle-line"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="ba-handle-button">
            <MoveHorizontal size={20} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px", fontSize: "0.85rem", color: "var(--slate-500)" }}>
        <span>Drag slider or click anywhere to compare</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--emerald-600)", fontWeight: "600" }}>
          <CheckCircle2 size={15} />
          <span>Real Liverpool Customer Results</span>
        </span>
      </div>
    </div>
  );
}
