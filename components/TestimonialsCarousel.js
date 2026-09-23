"use client";

import React, { useRef } from "react";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonialsData";

// Duplicate cards for seamless infinite loop
const CARDS = [...TESTIMONIALS, ...TESTIMONIALS];

export default function TestimonialsCarousel() {
  const trackRef = useRef(null);

  return (
    <>
      <style>{`
        .tcarousel-outer {
          overflow: hidden;
          position: relative;
          cursor: grab;
          padding: 2px 0 6px;
        }

        /* Fade edges */
        .tcarousel-outer::before,
        .tcarousel-outer::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 50px;
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
          gap: 14px;
          width: max-content;
          animation: scrollLeft 34s linear infinite;
          will-change: transform;
        }

        .tcarousel-outer:hover .tcarousel-track {
          animation-play-state: paused;
        }

        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .tcard {
          flex-shrink: 0;
          width: 285px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 14px 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(15,23,42,0.04);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          position: relative;
        }

        .tcard:hover {
          border-color: #6ee7b7;
          box-shadow: 0 6px 16px rgba(47,184,167,0.12);
          transform: translateY(-2px);
        }

        .tcard-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 5px;
        }

        .tcard-stars {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .tcard-badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 99px;
          background: #ecfdf5;
          color: #065f46;
          font-size: 0.65rem;
          font-weight: 700;
          max-width: 125px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tcard-text {
          font-size: 0.79rem;
          font-style: italic;
          color: #334155;
          line-height: 1.38;
          margin: 0 0 6px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tcard-author {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 6px;
          border-top: 1px solid #f1f5f9;
        }

        .tcard-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #6ee7b7;
          flex-shrink: 0;
        }

        .tcard-avatar-initial {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669, #2fb8a7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 0.72rem;
          flex-shrink: 0;
        }

        .tcard-name {
          font-weight: 700;
          font-size: 0.76rem;
          color: #0f172a;
          line-height: 1.2;
        }

        .tcard-meta {
          font-size: 0.66rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .tcard-source {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 1px 5px;
          border-radius: 99px;
          font-size: 0.6rem;
          font-weight: 700;
          border: 1px solid;
          width: fit-content;
        }

        .tcard-source.trustpilot {
          background: #e8f9f2;
          color: #005b3d;
          border-color: #a3e7cd;
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
      `}</style>

      <div
        className="tcarousel-outer"
        role="region"
        aria-label="Customer reviews carousel"
      >
        <div
          ref={trackRef}
          className="tcarousel-track"
        >
          {CARDS.map((t, i) => {
            const platform = t.platform || (t.id % 2 === 1 ? "google" : "facebook");
            const isTrustpilot = platform === "trustpilot";
            const isGoogle = platform === "google";
            const starColor = isTrustpilot ? "#00b67a" : "#f59e0b";
            return (
              <div key={`${t.id}-${i}`} className="tcard">
                {/* Top row: Stars + Badge */}
                <div className="tcard-top">
                  <div className="tcard-stars">
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[...Array(5)].map((_, s) => {
                        const isFilled = s < t.rating;
                        return (
                          <Star
                            key={s}
                            size={11}
                            fill={isFilled ? starColor : "#e2e8f0"}
                            color={isFilled ? starColor : "#cbd5e1"}
                          />
                        );
                      })}
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: "700", color: isTrustpilot ? "#007a52" : "#b45309", marginLeft: "4px" }}>
                      {t.rating}.0
                    </span>
                  </div>
                  <span className="tcard-badge">{t.badge}</span>
                </div>

                {/* Review text */}
                <p className="tcard-text">&ldquo;{t.text}&rdquo;</p>

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
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                      <div className="tcard-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                      <span className={`tcard-source ${platform}`}>
                        {isTrustpilot && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2l2.9 6.8 7.5.7-5.6 5 1.7 7.3L12 18l-6.5 3.8 1.7-7.3-5.6-5 7.5-.7L12 2z" fill="#00B67A"/>
                            <path d="M14.9 8.8L12 2v16l6.5 3.8-1.7-7.3 5.6-5-7.5-.7z" fill="#005128" opacity="0.35"/>
                          </svg>
                        )}
                        {isGoogle && (
                          <svg width="9" height="9" viewBox="0 0 488 488" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M488 252c0-17-1.5-33.5-4.3-49.5H249v93.7h134.7c-5.8 31.3-23.3 57.8-49.7 75.6v62.8h80.4C463 386 488 323.6 488 252z" fill="#4285F4"/>
                            <path d="M249 488c67.5 0 124.2-22.4 165.6-60.7l-80.4-62.8c-22.3 15-50.8 23.9-85.2 23.9-65.5 0-121-44.2-140.8-103.6H25.2v64.8C66.4 433.9 152.1 488 249 488z" fill="#34A853"/>
                            <path d="M108.2 285.8A146.6 146.6 0 0 1 102.8 249c0-12.8 2-25.2 5.4-37.2v-64.8H25.2A244.5 244.5 0 0 0 0 249c0 39.5 9.4 76.8 25.2 110.2l83-63.4z" fill="#FBBC04"/>
                            <path d="M249 98.2c36.9 0 70 12.7 96.1 37.6l71.9-71.9C374.1 24.3 316.8 0 249 0 152.1 0 66.4 54.1 25.2 138.8l83 64.8C128 143.4 183.5 98.2 249 98.2z" fill="#EA4335"/>
                          </svg>
                        )}
                        {!isTrustpilot && !isGoogle && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="#1877f2" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                          </svg>
                        )}
                        {isTrustpilot ? "Trustpilot" : isGoogle ? "Google" : "Facebook"}
                      </span>
                    </div>
                    <div className="tcard-meta">
                      <span>{t.location}</span>
                    </div>
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
