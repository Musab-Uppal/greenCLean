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
    <div className="max-w-[840px] mx-auto flex flex-col gap-3.5">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-150"
            style={{
              border: isOpen ? "1.5px solid var(--color-emerald-400)" : "1px solid var(--color-border-subtle)",
            }}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors duration-150"
              style={{ background: isOpen ? "var(--color-emerald-50)" : "#ffffff" }}
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={20} color={isOpen ? "#059669" : "#64748b"} className="shrink-0" />
                <span
                  className="font-bold text-[1.05rem]"
                  style={{ color: isOpen ? "var(--color-emerald-950)" : "var(--color-slate-800)" }}
                >
                  {faq.question}
                </span>
              </div>
              <ChevronDown
                size={18}
                className="shrink-0"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.25s ease",
                  color: isOpen ? "var(--color-emerald-600)" : "var(--color-slate-400)",
                }}
              />
            </button>

            {isOpen && (
              <div
                className="px-6 pb-[22px] pl-14 text-slate-700 text-[0.975rem] leading-[1.65]"
                style={{ background: "var(--color-emerald-50)", animation: "dropdownFadeIn 0.2s ease" }}
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
