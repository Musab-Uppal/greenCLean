"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS } from "@/data/faqsData";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div style={{ maxWidth: "840px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div 
            key={idx}
            className="glass-card"
            style={{
              borderRadius: "var(--radius-md)",
              border: isOpen ? "1.5px solid var(--emerald-400)" : "1px solid var(--border-subtle)",
              overflow: "hidden",
              transition: "all var(--transition-fast)"
            }}
          >
            <button
              onClick={() => toggle(idx)}
              style={{
                width: "100%",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                textAlign: "left",
                background: isOpen ? "var(--emerald-50)" : "#ffffff",
                transition: "background var(--transition-fast)"
              }}
              aria-expanded={isOpen}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <HelpCircle size={20} color={isOpen ? "#059669" : "#64748b"} style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: "700", fontSize: "1.05rem", color: isOpen ? "var(--emerald-950)" : "var(--slate-800)" }}>
                  {faq.question}
                </span>
              </div>
              <ChevronDown 
                size={18} 
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.25s ease",
                  color: isOpen ? "var(--emerald-600)" : "var(--slate-400)",
                  flexShrink: 0
                }} 
              />
            </button>

            {isOpen && (
              <div 
                style={{
                  padding: "0 24px 22px 56px",
                  background: "var(--emerald-50)",
                  color: "var(--slate-700)",
                  fontSize: "0.975rem",
                  lineHeight: "1.65",
                  animation: "dropdownFadeIn 0.2s ease"
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
