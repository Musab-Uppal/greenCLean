import React from "react";
import Link from "next/link";
import { Phone, Mail, Clock } from "lucide-react";

export default function Footer({ categories = [] }) {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-6 pb-5 border-t border-white/[0.08]">
      <div className="w-full max-w-[1260px] mx-auto px-5 md:px-8">
        {/* Main horizontal row */}
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">

          <a
            href="tel:07359068284"
            className="inline-flex items-center gap-2.5 text-white font-bold text-[0.95rem] no-underline whitespace-nowrap"
          >
            <div className="w-[30px] h-[30px] rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 shrink-0">
              <Phone size={15} />
            </div>
            <span>07359068284</span>
          </a>

          <a
            href="mailto:contact@greencleangroup.co.uk"
            className="inline-flex items-center gap-2.5 text-slate-200 text-sm no-underline whitespace-nowrap"
          >
            <div className="w-[30px] h-[30px] rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 shrink-0">
              <Mail size={15} />
            </div>
            <span>contact@greencleangroup.co.uk</span>
          </a>

          <div className="inline-flex items-center gap-2.5 text-slate-200 text-sm whitespace-nowrap">
            <div className="w-[30px] h-[30px] rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock size={15} />
            </div>
            <span>Monday – Sunday: 08:00 – 19:00</span>
          </div>

          <a
            href="https://www.facebook.com/people/Green-Clean-Group-Liverpool/100095290844672/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold no-underline whitespace-nowrap hover:bg-white/[0.18] transition-colors duration-200"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Follow us on Facebook</span>
          </a>
        </div>

        {/* Bottom */}
        <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-center gap-4 text-[0.825rem] text-slate-500">
          <Link href="/privacy-policy" className="text-slate-400 hover:text-emerald-400 transition-colors duration-150">Privacy Policy</Link>
          <span className="text-slate-600">•</span>
          <Link href="/terms-and-conditions" className="text-slate-400 hover:text-emerald-400 transition-colors duration-150">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
