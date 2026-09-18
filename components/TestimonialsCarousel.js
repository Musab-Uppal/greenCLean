"use client";

import React, { useRef, useState } from "react";
import { Star, CheckCircle, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonialsData";

// Duplicate cards for seamless infinite loop
const CARDS = [...TESTIMONIALS, ...TESTIMONIALS];

export default function TestimonialsCarousel() {
  const trackRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <style>{`
        .tcarousel-outer {
          overflow: hidden;
          cursor: pointer;
          position: relative;
        }

        /* Fade edges */
        .tcarousel-outer::before,
        .tcarousel-outer::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 80px;
          z-index: 2;
          pointer-events: none;
        }
        .tcarousel-outer::before {
          left: 0;
          background: linear-gradient(to right, #ffffff, transparent);
        }
        .tcarousel-outer::after {
          right: 0;
          background: linear-gradient(to left, #ffffff, transparent);
        }

        .tcarousel-track {
          display: flex;
          gap: 20px;
          width: max-content;
          /* Animation runs only when .playing class is present */
          animation: none;
          will-change: transform;
        }

        .tcarousel-track.playing {
          animation: scrollLeft 22s linear infinite;
        }

        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .tcard {
          flex-shrink: 0;
          width: 340px;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          padding: 28px 26px;
          display: flex;
          flex-direction: column;
          /* Equal height via flex – align-items stretch on track */
          box-shadow: 0 4px 16px rgba(15,23,42,0.06);
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          position: relative;
        }

        .tcard:hover {
          border-color: #6ee7b7;
          box-shadow: 0 10px 32px rgba(47,184,167,0.14);
          transform: translateY(-3px);
        }

        .tcard-quote {
          position: absolute;
          top: 18px;
          right: 20px;
          opacity: 0.08;
        }

        .tcard-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 14px;
        }

        .tcard-text {
          font-size: 0.95rem;
          font-style: italic;
          color: #334155;
          line-height: 1.7;
          flex: 1;        /* pushes author to bottom */
          margin-bottom: 20px;
        }

        .tcard-author {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .tcard-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #6ee7b7;
          flex-shrink: 0;
        }

        .tcard-avatar-initial {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669, #2fb8a7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .tcard-name {
          font-weight: 750;
          font-size: 0.92rem;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .tcard-meta {
          font-size: 0.78rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .tcard-badge {
          display: inline-block;
          padding: 3px 9px;
          border-radius: 99px;
          background: #ecfdf5;
          color: #065f46;
          font-size: 0.72rem;
          font-weight: 700;
          margin-top: 10px;
          width: fit-content;
        }

        .tcarousel-hint {
          text-align: center;
          font-size: 0.82rem;
          color: #94a3b8;
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: opacity 0.3s;
        }

        .tcarousel-hint.hidden { opacity: 0; }
      `}</style>

      {/* Hint */}
      <p className={`tcarousel-hint${playing ? " hidden" : ""}`}>
        <span>👆</span> Hover the reviews to scroll through them
      </p>

      <div
        className="tcarousel-outer"
        onMouseEnter={() => setPlaying(true)}
        onMouseLeave={() => setPlaying(false)}
        role="region"
        aria-label="Customer reviews carousel — hover to scroll"
      >
        <div
          ref={trackRef}
          className={`tcarousel-track${playing ? " playing" : ""}`}
        >
          {CARDS.map((t, i) => (
            <div key={`${t.id}-${i}`} className="tcard">
              {/* Decorative quote */}
              <Quote size={52} className="tcard-quote" color="#10b981" />

              {/* Stars */}
              <div className="tcard-stars">
                {[...Array(t.rating)].map((_, s) => (
                  <Star key={s} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>

              {/* Review text */}
              <p className="tcard-text">"{t.text}"</p>

              {/* Badge */}
              <span className="tcard-badge">{t.badge}</span>

              {/* Author */}
              <div className="tcard-author">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="tcard-avatar"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="tcard-avatar-initial">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="tcard-name">{t.name}</div>
                  <div className="tcard-meta">
                    <span>{t.location}</span>
                    <span>·</span>
                    <span style={{ color: "#059669", display: "inline-flex", alignItems: "center", gap: "3px", fontWeight: 600 }}>
                      <CheckCircle size={11} />
                      {t.service}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
