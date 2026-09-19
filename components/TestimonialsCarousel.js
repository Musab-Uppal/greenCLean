"use client";

import React, { useRef, useState } from "react";
import { Star, Quote } from "lucide-react";
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

        .tcard-source {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          border-radius: 99px;
          font-size: 0.72rem;
          font-weight: 700;
          margin-top: 4px;
          width: fit-content;
          border: 1px solid;
        }

        .tcard-source.google {
          background: #fff8f6;
          color: #c5221f;
          border-color: #f5c6c5;
        }

        .tcard-source.facebook {
          background: #f0f4ff;
          color: #1877f2;
          border-color: #c3d4fc;
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
          {CARDS.map((t, i) => {
            const isGoogle = t.id % 2 === 1;
            const platform = isGoogle ? "google" : "facebook";
            return (
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
                <p className="tcard-text">&ldquo;{t.text}&rdquo;</p>

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
                    </div>
                    {/* Platform source badge */}
                    <span className={`tcard-source ${platform}`}>
                      {isGoogle ? (
                        /* Google G icon */
                        <svg width="11" height="11" viewBox="0 0 488 488" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M488 252c0-17-1.5-33.5-4.3-49.5H249v93.7h134.7c-5.8 31.3-23.3 57.8-49.7 75.6v62.8h80.4C463 386 488 323.6 488 252z" fill="#4285F4"/>
                          <path d="M249 488c67.5 0 124.2-22.4 165.6-60.7l-80.4-62.8c-22.3 15-50.8 23.9-85.2 23.9-65.5 0-121-44.2-140.8-103.6H25.2v64.8C66.4 433.9 152.1 488 249 488z" fill="#34A853"/>
                          <path d="M108.2 285.8A146.6 146.6 0 0 1 102.8 249c0-12.8 2-25.2 5.4-37.2v-64.8H25.2A244.5 244.5 0 0 0 0 249c0 39.5 9.4 76.8 25.2 110.2l83-63.4z" fill="#FBBC04"/>
                          <path d="M249 98.2c36.9 0 70 12.7 96.1 37.6l71.9-71.9C374.1 24.3 316.8 0 249 0 152.1 0 66.4 54.1 25.2 138.8l83 64.8C128 143.4 183.5 98.2 249 98.2z" fill="#EA4335"/>
                        </svg>
                      ) : (
                        /* Facebook f icon */
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#1877f2" xmlns="http://www.w3.org/2000/svg">
                          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                        </svg>
                      )}
                      {isGoogle ? "Google Review" : "Facebook Review"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
