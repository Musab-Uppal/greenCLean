"use client";

import React from "react";
import Link from "next/link";
import { Phone, ShieldCheck, Sparkles, CreditCard, Clock } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="top-bar-inner">
          <div className="top-bar-left">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>

            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <CreditCard size={14} color="#34d399" />
              <span>Pay by Card or Cash</span>
            </span>
          </div>
          <div className="top-bar-right">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Clock size={14} color="#34d399" />
              <span>Mon – Sun: 08:00 – 19:00</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={14} color="#34d399" />
              <span>Fully Insured & Guaranteed</span>
            </span>
            <a
              href="tel:07359068284"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "700",
                color: "#a7f3d0"
              }}
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
