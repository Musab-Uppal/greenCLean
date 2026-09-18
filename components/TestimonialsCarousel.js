"use client";

import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonialsData";

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slideshow every 4.5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <div 
      style={{ position: "relative", maxWidth: "920px", margin: "0 auto" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Customer Testimonials Carousel"
    >
      {/* Testimonial Card */}
      <div 
        key={current.id}
        className="glass-card"
        style={{
          padding: "44px 36px",
          border: "1.5px solid var(--emerald-200)",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.6) 100%)",
          position: "relative",
          animation: "fadeIn 0.4s ease",
          transition: "all 0.3s ease"
        }}
      >
        <Quote 
          size={56} 
          color="rgba(16, 185, 129, 0.15)" 
          style={{ position: "absolute", top: "24px", right: "32px" }} 
        />

        {/* Rating Stars */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "18px" }}>
          {[...Array(current.rating)].map((_, i) => (
            <Star key={i} size={20} fill="#f59e0b" color="#f59e0b" />
          ))}
        </div>

        {/* Quote text */}
        <p style={{
          fontSize: "1.25rem",
          fontWeight: "500",
          lineHeight: "1.7",
          color: "var(--slate-800)",
          marginBottom: "28px",
          fontStyle: "italic",
          minHeight: "75px"
        }}>
          "{current.text}"
        </p>

        {/* Author info */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {current.avatar ? (
              <img 
                src={current.avatar} 
                alt={current.name}
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--emerald-400)",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  flexShrink: 0
                }}
              />
            ) : (
              <div style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--emerald-600) 0%, var(--teal-600) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: "800",
                fontSize: "1.1rem",
                flexShrink: 0
              }}>
                {current.name.charAt(0)}
              </div>
            )}
            <div>
              <div style={{ fontWeight: "800", fontSize: "1.05rem", color: "var(--slate-900)" }}>
                {current.name}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>{current.location}</span>
                <span>•</span>
                <span style={{ color: "var(--emerald-600)", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle size={13} /> {current.service}
                </span>
              </div>
            </div>
          </div>

          <span style={{
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
            background: "var(--emerald-100)",
            color: "var(--emerald-800)",
            fontSize: "0.8rem",
            fontWeight: "700"
          }}>
            {current.badge}
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
        <button 
          onClick={prev}
          aria-label="Previous testimonial"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#ffffff",
            border: "1px solid var(--slate-200)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--slate-700)",
            boxShadow: "var(--shadow-sm)",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--emerald-500)"}
          onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--slate-200)"}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Indicators */}
        <div style={{ display: "flex", gap: "8px" }}>
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: idx === currentIndex ? "28px" : "10px",
                height: "10px",
                borderRadius: "var(--radius-full)",
                background: idx === currentIndex ? "var(--emerald-600)" : "var(--slate-300)",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>

        <button 
          onClick={next}
          aria-label="Next testimonial"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#ffffff",
            border: "1px solid var(--slate-200)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--slate-700)",
            boxShadow: "var(--shadow-sm)",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--emerald-500)"}
          onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--slate-200)"}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
