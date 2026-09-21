"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, CheckCircle2, AlertCircle, Search, Phone, Calendar } from "lucide-react";
import { SERVICE_AREAS } from "@/data/faqsData";

export default function AreaChecker() {
  const [postcode, setPostcode] = useState("");
  const [result, setResult] = useState(null);

  const checkPostcode = (e) => {
    e?.preventDefault();
    if (!postcode.trim()) return;

    const cleanInput = postcode.trim().toUpperCase().replace(/\s+/g, "");
    const prefixMatch = cleanInput.match(/^([A-Z]{1,2}[0-9]{1,2})/);
    const prefix = prefixMatch ? prefixMatch[1] : cleanInput.slice(0, 3);

    const merseyside = SERVICE_AREAS[0];
    const cheshire = SERVICE_AREAS[1];
    const manchester = SERVICE_AREAS[2];

    if (merseyside.postcodes.some(p => cleanInput.startsWith(p))) {
      setResult({ status: "covered", region: "Merseyside (Priority Route)", message: "Great news! Your area is fully covered with standard daily routes and flexible morning/afternoon time slots.", badge: "Full Daily Coverage" });
    } else if (cheshire.postcodes.some(p => cleanInput.startsWith(p))) {
      setResult({ status: "covered", region: "Cheshire & Surrounding", message: "Yes! We serve your area with regular weekly routes.", badge: "Regular Coverage" });
    } else if (manchester.postcodes.some(p => cleanInput.startsWith(p))) {
      setResult({ status: "covered", region: "Greater Manchester & Lancashire", message: "We cover your area on select scheduled days each week.", badge: "Scheduled Route" });
    } else {
      setResult({ status: "inquire", region: "Outside Primary Core", message: "You are just outside our primary online booking zone. Please contact our dispatch team at 07359068284 to check our special travel schedule for your location.", badge: "Call to Confirm" });
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border-[1.5px] border-emerald-200 rounded-3xl shadow-md p-9">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <MapPin size={22} />
        </div>
        <div>
          <h3 className="text-[1.35rem] font-extrabold text-slate-900">Check Service Availability</h3>
          <p className="text-[0.9rem] text-slate-600">Enter your Liverpool or North West postcode to verify service:</p>
        </div>
      </div>

      <form onSubmit={checkPostcode} className="flex gap-3 flex-wrap mb-5">
        <div className="relative flex-1 basis-60">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="e.g. L1 8JQ, L25, WA10, CH41..."
            className="form-input w-full py-[13px] pr-4 pl-[42px] border-[1.5px] border-slate-200 rounded-[10px] bg-white text-slate-800 text-[0.95rem] transition-colors duration-150"
            aria-label="Postcode input"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-[0.975rem] shadow-[0_10px_25px_-5px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-4px_rgba(16,185,129,0.45)] active:translate-y-0 transition-all duration-200"
        >
          Check Coverage
        </button>
      </form>

      {/* Quick sample pills */}
      <div className="flex items-center gap-2 flex-wrap text-sm text-slate-500 mb-5">
        <span>Quick check:</span>
        {["L1 (Liverpool)", "L23 (Crosby)", "WA10 (St Helens)", "CH41 (Birkenhead)", "M1 (Manchester)"].map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => { const code = sample.split(" ")[0]; setPostcode(code); setTimeout(() => checkPostcode(), 50); }}
            className="px-2.5 py-1 rounded-full bg-slate-100 text-[0.8rem] font-semibold text-slate-700 hover:bg-emerald-100 transition-colors duration-200"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Coverage Result */}
      {result && (
        <div
          className="p-[18px_20px] rounded-2xl"
          style={{
            background: result.status === "covered" ? "var(--color-emerald-50)" : "var(--color-danger-50)",
            border: `1.5px solid ${result.status === "covered" ? "var(--color-emerald-300)" : "#fca5a5"}`,
            animation: "dropdownFadeIn 0.3s ease"
          }}
        >
          <div className="flex items-start gap-3">
            {result.status === "covered" ? (
              <CheckCircle2 size={24} color="#059669" className="shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={24} color="#dc2626" className="shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1">
                <span
                  className="font-extrabold text-[1.05rem]"
                  style={{ color: result.status === "covered" ? "var(--color-emerald-900)" : "#991b1b" }}
                >
                  {result.region}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: result.status === "covered" ? "var(--color-emerald-200)" : "#fecaca",
                    color: result.status === "covered" ? "var(--color-emerald-800)" : "#7f1d1d"
                  }}
                >
                  {result.badge}
                </span>
              </div>
              <p className="text-[0.9rem] text-slate-700 leading-[1.5] mb-3.5">{result.message}</p>
              <div className="flex gap-2.5 flex-wrap">
                {result.status === "covered" ? (
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center gap-2.5 px-[18px] py-[9px] rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-[0_4px_14px_0_rgba(16,185,129,0.25)] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Calendar size={14} />
                    <span>Proceed to Book Online</span>
                  </Link>
                ) : (
                  <a
                    href="tel:07359068284"
                    className="inline-flex items-center justify-center gap-2.5 px-[18px] py-[9px] rounded-full bg-white text-emerald-800 font-semibold text-sm border border-emerald-200 shadow-sm hover:bg-emerald-50 hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Phone size={14} />
                    <span>Call 07359068284</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
