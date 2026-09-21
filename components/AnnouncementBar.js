"use client";

import React from "react";
import Link from "next/link";
import { Phone, ShieldCheck, Sparkles, CreditCard, Clock } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-teal-700 text-white text-sm py-2 px-4 border-b border-white/10">
      <div className="w-full max-w-[1260px] mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between gap-4 max-md:justify-center">
          <div className="flex items-center gap-[18px]">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={14} color="#34d399" />
              <span><strong>100% Eco-Friendly</strong> Non-Toxic Cleaning in Liverpool</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CreditCard size={14} color="#34d399" />
              <span>Pay by Card or Cash</span>
            </span>
          </div>
          <div className="max-md:hidden flex items-center gap-[18px]">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} color="#34d399" />
              <span>Mon – Sun: 08:00 – 19:00</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} color="#34d399" />
              <span>Fully Insured &amp; Guaranteed</span>
            </span>
            <a
              href="tel:07359068284"
              className="inline-flex items-center gap-1.5 font-bold text-emerald-200"
            >
              <Phone size={13} />
              <span>07359068284</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
