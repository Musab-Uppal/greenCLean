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

  const handleTouchMove = (e) => { if (!isDragging) return; handleMove(e.touches[0].clientX); };
  const handleMouseMove = (e) => { if (!isDragging) return; handleMove(e.clientX); };

  return (
    <div className="relative">
      {/* Slider container */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] md:h-[460px] rounded-3xl overflow-hidden shadow-xl select-none touch-none border-[3px] border-emerald-500/30"
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
        {/* AFTER Layer */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center p-5"
          style={{ background: "linear-gradient(135deg, #022c22 0%, #064e3b 40%, #0f766e 100%)" }}
        >
          <div className="w-[85%] h-[80%] rounded-2xl border-4 border-emerald-500 relative overflow-hidden flex flex-col justify-between p-6"
            style={{ background: "radial-gradient(circle at 50% 50%, #065f46 0%, #022c22 100%)", boxShadow: "0 0 40px rgba(16,185,129,0.4), inset 0 0 30px rgba(52,211,153,0.2)" }}
          >
            <div className="absolute top-[20%] right-[25%] text-emerald-300" style={{ animation: "pulseGlow 2s infinite" }}>
              <Sparkles size={32} />
            </div>
            <div className="absolute bottom-[25%] left-[30%] text-emerald-400">
              <Sparkles size={24} />
            </div>
            <div className="flex flex-col gap-[18px] mt-5">
              {[0,1,2].map(i => (
                <div key={i} className="h-1.5 w-full rounded-[4px]" style={{ background: "linear-gradient(90deg,#94a3b8,#f8fafc,#94a3b8)", boxShadow: "0 2px 8px rgba(255,255,255,0.6)" }} />
              ))}
            </div>
            <div className="text-right text-emerald-200 font-bold text-[0.95rem]">✨ 100% Non-Toxic Dipping Tank Result</div>
          </div>
          <span
            className="absolute top-[18px] right-[18px] px-3.5 py-1.5 rounded-full text-[0.775rem] font-extrabold uppercase tracking-widest z-10 backdrop-blur-md"
            style={{ background: "rgba(5,150,105,0.85)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.3)", boxShadow: "0 2px 10px rgba(5,150,105,0.5)" }}
          >
            After: Spotless &amp; Fresh
          </span>
        </div>

        {/* BEFORE Layer */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center p-5"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`, background: "linear-gradient(135deg,#1c1917 0%,#292524 50%,#44403c 100%)" }}
        >
          <div className="w-[85%] h-[80%] rounded-2xl border-4 border-[#78716c] relative overflow-hidden flex flex-col justify-between p-6"
            style={{ background: "radial-gradient(circle at 40% 40%,#451a03 0%,#1c1917 100%)", filter: "contrast(1.2)" }}
          >
            <div className="absolute top-[15%] left-[15%] w-[140px] h-[80px] rounded-[60%_40%_70%_30%] blur-[8px]" style={{ background: "rgba(120,53,15,0.8)" }} />
            <div className="absolute bottom-[20%] right-[20%] w-[180px] h-[100px] rounded-[40%_60%_30%_70%] blur-[12px]" style={{ background: "rgba(69,26,3,0.9)" }} />
            <div className="flex flex-col gap-[18px] mt-5 opacity-50">
              <div className="h-1.5 w-full rounded-[4px] bg-[#44403c]" />
              <div className="h-1.5 w-full rounded-[4px] bg-[#292524]" />
              <div className="h-1.5 w-full rounded-[4px] bg-[#44403c]" />
            </div>
            <div className="text-left text-red-300 font-bold text-[0.95rem]">⚠️ Heavy Baked-on Carbon &amp; Grease</div>
          </div>
          <span
            className="absolute top-[18px] left-[18px] px-3.5 py-1.5 rounded-full text-[0.775rem] font-extrabold uppercase tracking-widest z-10 backdrop-blur-md"
            style={{ background: "rgba(15,23,42,0.75)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            Before: Burnt-On Grease
          </span>
        </div>

        {/* Draggable Handle */}
        <div className="absolute top-0 bottom-0 w-1 bg-white -translate-x-1/2 z-20 shadow-[0_0_10px_rgba(0,0,0,0.4)]" style={{ left: `${sliderPosition}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full border-[3px] border-emerald-600 shadow-[0_4px_15px_rgba(0,0,0,0.25)] flex items-center justify-center text-emerald-700 cursor-ew-resize">
            <MoveHorizontal size={20} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm text-slate-500">
        <span>Drag slider or click anywhere to compare</span>
        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
          <CheckCircle2 size={15} />
          <span>Real Liverpool Customer Results</span>
        </span>
      </div>
    </div>
  );
}
