"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import {
  CheckCircle2,
  Calendar,
  Leaf,
  Clock,
  ShieldCheck,
  Smile,
  HeartHandshake,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AboutPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const workImages = [
    { src: "/work done/b-a-img.jpg", alt: "Before and after cleaning" },
    { src: "/work done/clean-servive-img-1.jpg", alt: "Clean service result 1" },
    { src: "/work done/clean-servive-img-2.jpg", alt: "Clean service result 2" },
    { src: "/work done/clean-servive-img-3.jpg", alt: "Clean service result 3" },
    { src: "/work done/clean-servive-img-4.jpg", alt: "Clean service result 4" },
    { src: "/work done/clean-servive-img-5.jpg", alt: "Clean service result 5" },
    { src: "/work done/clean-servive-img-6.jpg", alt: "Clean service result 6" },
    { src: "/work done/clean-servive-img-7.jpg", alt: "Clean service result 7" },
    { src: "/work done/e68347cc-2f39-4580-88cb-3bcf9b07d742-1.jpg", alt: "Professional cleaning result" },
    { src: "/work done/serviveinr-img-1.jpg", alt: "Service interior result" },
  ];

  // Auto-advance every 3.5s; pause while lightbox is open
  useEffect(() => {
    if (lightboxOpen) return;
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % workImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [lightboxOpen, workImages.length]);

  const stats = [

    { icon: "⭐", label: "Years of Experience", value: "7+" },
    { icon: "📋", label: "Orders per Year", value: "1,000+" },
    { icon: "🌟", label: "Star Reviews", value: "5 Star" },
    { icon: "🌿", label: "ECO Products", value: "100%" },
    { icon: "😊", label: "Pleasant & Trustworthy", value: "Always" },
    { icon: "🛡️", label: "Insured Workers", value: "Fully" },
  ];

  const whyUs = [
    {
      icon: <Leaf size={32} color="#2fb8a7" />,
      title: "Green and Safe",
      desc: "Our eco-friendly, all natural products ensure safety from dangerous chemicals, and allows families to avoid risky additives.",
    },
    {
      icon: <Clock size={32} color="#2fb8a7" />,
      title: "Service on Schedule",
      desc: "Flexible schedule ensures that you can choose the best date and time that suits your needs.",
    },
    {
      icon: <ShieldCheck size={32} color="#2fb8a7" />,
      title: "Insured Services",
      desc: "We are fully insured, this provides protection for our staff and customers.",
    },
    {
      icon: <Smile size={32} color="#2fb8a7" />,
      title: "Pleasant & Trustworthy",
      desc: "We constantly strive to provide excellent service, and all our staff are pleasant and trustworthy.",
    },
    {
      icon: <HeartHandshake size={32} color="#2fb8a7" />,
      title: "Customer Support",
      desc: "Our polite and kind customer support team is always ready to help you. We go beyond meeting your needs.",
    },
    {
      icon: <Star size={32} color="#2fb8a7" />,
      title: "Client Satisfaction",
      desc: "Keeping our customers happy is our number one priority. Our customers' reviews speak for themselves.",
    },
  ];

  const openLightbox  = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);
  const prevSlide = () => setSlideIndex(i => (i - 1 + workImages.length) % workImages.length);
  const nextSlide = () => setSlideIndex(i => (i + 1) % workImages.length);


  return (
    <>
      <style>{`
        /* ── Hero Banner ── */
        .about-hero {
          position: relative;
          background: linear-gradient(135deg, #064e3b 0%, #065f46 40%, #2fb8a7 100%);
          padding: 100px 20px 80px;
          text-align: center;
          overflow: hidden;
        }
        .about-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }
        .about-hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
        .about-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
          color: #a7f3d0; border: 1px solid rgba(255,255,255,0.2);
          font-size: 0.82rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; padding: 7px 18px; border-radius: 999px;
          margin-bottom: 24px;
        }
        .about-hero h1 {
          font-size: clamp(2rem, 5vw, 3.4rem);
          font-weight: 900; color: #ffffff;
          line-height: 1.15; margin-bottom: 20px;
          letter-spacing: -0.025em;
        }
        .about-hero h1 span { color: #6ee7b7; }
        .about-hero p {
          font-size: 1.12rem; color: rgba(255,255,255,0.82);
          line-height: 1.7; max-width: 620px; margin: 0 auto 32px;
        }
        .about-hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        /* ── Story Section ── */
        .about-story {
          padding: 90px 20px;
          background: #fff;
        }
        .about-story-inner {
          max-width: 1260px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: center;
        }
        @media (max-width: 900px) {
          .about-story-inner { grid-template-columns: 1fr; gap: 40px; }
        }
        .about-story-img {
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 20px 50px rgba(6,78,59,0.18);
          aspect-ratio: 4/3;
          position: relative;
        }
        .about-story-text h2 {
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          font-weight: 850; color: #0f172a;
          margin-bottom: 18px; line-height: 1.2;
        }
        .about-story-text h2 span { color: #2fb8a7; }
        .about-story-text p {
          font-size: 1.02rem; color: #475569;
          line-height: 1.75; margin-bottom: 16px;
        }
        .about-checklist { display: flex; flex-direction: column; gap: 11px; margin-top: 22px; }
        .about-checklist-item {
          display: flex; align-items: flex-start; gap: 11px;
          font-size: 0.95rem; font-weight: 600; color: #1e293b;
        }
        .about-checklist-item svg { flex-shrink: 0; margin-top: 2px; }

        /* ── Stats Bar ── */
        .about-stats {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 0;
        }
        .about-stats-inner {
          max-width: 1260px; margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          padding: 0 20px;
        }
        @media (max-width: 1024px) {
          .about-stats-inner { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 580px) {
          .about-stats-inner { grid-template-columns: repeat(2, 1fr); }
        }
        .about-stat-item {
          padding: 28px 16px;
          text-align: center;
          border-right: 1px solid #e2e8f0;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .about-stat-item:last-child { border-right: none; }
        .about-stat-icon { font-size: 1.6rem; }
        .about-stat-val {
          font-size: 1.25rem; font-weight: 800; color: #064e3b;
        }
        .about-stat-label {
          font-size: 0.78rem; font-weight: 600; color: #64748b;
          text-transform: uppercase; letter-spacing: 0.05em;
          text-align: center;
        }

        /* ── Why Choose Us ── */
        .about-why {
          padding: 90px 20px;
          background: #fff;
        }
        .about-why-inner { max-width: 1260px; margin: 0 auto; }
        .about-why-header { text-align: center; margin-bottom: 56px; }
        .about-why-header h2 {
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 850; color: #0f172a; margin-bottom: 14px;
        }
        .about-why-header p { font-size: 1.05rem; color: #64748b; max-width: 580px; margin: 0 auto; }
        .about-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .about-why-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .about-why-grid { grid-template-columns: 1fr; }
        }
        .why-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 32px 28px;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow: hidden;
        }
        .why-card::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 100%; height: 3px;
          background: linear-gradient(90deg, #2fb8a7, #10b981);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s ease;
        }
        .why-card:hover {
          background: #fff;
          border-color: #a7f3d0;
          box-shadow: 0 12px 30px rgba(47,184,167,0.12);
          transform: translateY(-4px);
        }
        .why-card:hover::after { transform: scaleX(1); }
        .why-card-icon {
          width: 56px; height: 56px; border-radius: 14px;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
        }
        .why-card h3 {
          font-size: 1.07rem; font-weight: 750; color: #0f172a;
          margin-bottom: 10px;
        }
        .why-card p { font-size: 0.92rem; color: #64748b; line-height: 1.65; }

        /* ── Our Latest Work Slideshow ── */
        .about-gallery {
          padding: 90px 20px;
          background: linear-gradient(180deg, #f8fafc 0%, #ecfdf5 100%);
        }
        .about-gallery-inner { max-width: 640px; margin: 0 auto; }

        .about-gallery-header { text-align: center; margin-bottom: 44px; }
        .about-gallery-header h2 {
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 850; color: #0f172a; margin-bottom: 14px;
        }
        .about-gallery-header p { font-size: 1.05rem; color: #64748b; max-width: 560px; margin: 0 auto; }

        /* Main slide */
        .gslide-wrap {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 16px;
          overflow: hidden;
          background: #1e293b;
          box-shadow: 0 12px 36px rgba(6,78,59,0.15);
          cursor: pointer;
          margin-bottom: 12px;
        }

        .gslide-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .gslide-img.enter  { opacity: 0; transform: scale(1.04); }
        .gslide-img.active { opacity: 1; transform: scale(1); }
        .gslide-img.exit   { opacity: 0; transform: scale(0.97); }

        /* Overlay on hover */
        .gslide-hover-overlay {
          position: absolute; inset: 0;
          background: rgba(6,78,59,0);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.3s ease;
        }
        .gslide-wrap:hover .gslide-hover-overlay { background: rgba(6,78,59,0.35); }
        .gslide-expand-icon {
          width: 56px; height: 56px;
          background: rgba(255,255,255,0.92);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem;
          opacity: 0; transform: scale(0.6);
          transition: all 0.3s ease;
        }
        .gslide-wrap:hover .gslide-expand-icon { opacity: 1; transform: scale(1); }

        /* Counter badge */
        .gslide-counter {
          position: absolute; top: 14px; right: 14px;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
          color: #fff; font-size: 0.78rem; font-weight: 700;
          padding: 4px 10px; border-radius: 99px;
          pointer-events: none;
        }

        /* Arrow buttons */
        .gslide-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(6px);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
          z-index: 10;
          color: #064e3b;
        }
        .gslide-arrow:hover { background: #fff; transform: translateY(-50%) scale(1.1); }
        .gslide-arrow.prev { left: 14px; }
        .gslide-arrow.next { right: 14px; }

        /* Dot indicators */
        .gslide-dots {
          display: flex; gap: 8px; justify-content: center; margin-bottom: 18px;
        }
        .gslide-dot {
          height: 8px; border-radius: 99px;
          background: #cbd5e1;
          transition: all 0.3s ease;
          border: none; cursor: pointer; padding: 0;
        }
        .gslide-dot.active { background: #059669; width: 28px !important; }

        /* Thumbnail strip */
        .gthumb-strip {
          display: flex; gap: 10px;
          overflow-x: auto; padding-bottom: 4px;
          scrollbar-width: none;
        }
        .gthumb-strip::-webkit-scrollbar { display: none; }
        .gthumb {
          flex-shrink: 0;
          width: 72px; height: 50px;
          border-radius: 8px; overflow: hidden;

          cursor: pointer;
          border: 2.5px solid transparent;
          transition: all 0.2s ease;
          background: #e2e8f0;
          opacity: 0.65;
        }
        .gthumb:hover { opacity: 0.9; }
        .gthumb.active { border-color: #059669; opacity: 1; box-shadow: 0 0 0 2px #d1fae5; }
        .gthumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ── Lightbox ── */
        .lightbox-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(2, 8, 23, 0.92);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .lightbox-content {
          position: relative; max-width: 90vw; max-height: 90vh;
          display: flex; flex-direction: column; align-items: center;
        }
        .lightbox-img-wrap {
          position: relative; width: min(880px, 90vw); height: min(60vh, 600px);
          border-radius: 12px; overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6);
        }
        .lightbox-close {
          position: absolute; top: -48px; right: 0;
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .lightbox-close:hover { background: rgba(255,255,255,0.25); }
        .lightbox-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .lightbox-nav:hover { background: rgba(255,255,255,0.28); }
        .lightbox-prev { left: -60px; }
        .lightbox-next { right: -60px; }
        .lightbox-counter {
          margin-top: 16px; color: rgba(255,255,255,0.55);
          font-size: 0.9rem; font-weight: 600;
        }

        /* ── CTA Section ── */
        .about-cta {
          padding: 80px 20px;
          background: linear-gradient(135deg, #064e3b 0%, #2fb8a7 100%);
          text-align: center;
        }
        .about-cta h2 {
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          font-weight: 850; color: #fff; margin-bottom: 14px;
        }
        .about-cta p { font-size: 1.05rem; color: rgba(255,255,255,0.8); max-width: 500px; margin: 0 auto 32px; }
      `}</style>

      {/* ── HERO BANNER ── */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-badge">
            <span>🌿</span>
            <span>About Us — Green Clean Group</span>
          </div>
          <h1>
            Where spotless cleaning<br />
            comes to your <span>door</span>
          </h1>
          <p>
            A family-run cleaning business based in Liverpool, delivering eco-friendly, non-toxic
            cleaning solutions you can truly trust — for over 7 years.
          </p>
          <div className="about-hero-btns">
            <Link href="/book" className="btn btn-primary btn-lg">
              <Calendar size={18} />
              Book a Service
            </Link>
            <Link href="/contact" className="btn btn-outline-white btn-lg">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ── STORY SECTION ── */}
      <section className="about-story">
        <div className="about-story-inner">
          {/* Image side */}
          <div className="about-story-img">
            <Image
              src="/work done/b-a-img.jpg"
              alt="Green Clean Group - Before & After"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>

          {/* Text side */}
          <div className="about-story-text">
            <span className="section-pill">
              <Leaf size={14} />
              Our Story
            </span>
            <h2>
              Welcome to <span>Green Clean Group</span>
            </h2>
            <p>
              Welcome to Green Clean Group, where expertise meets a personal touch in cleaning
              services. As a cherished family business with numerous years of experience, we take
              immense pride in providing top-tier cleaning solutions to the vibrant community of
              Liverpool and its surrounding areas.
            </p>
            <p>
              At Green Clean Group, we understand that a clean and organised living space is the
              cornerstone of a comfortable home. Our dedicated team of professionals specialises in a
              comprehensive range of services, particularly in cleaning ovens and homes. With a keen
              eye for detail and a commitment to excellence, we transform spaces into pristine
              environments that exude freshness and hygiene.
            </p>
            <p>
              Our commitment to professionalism is unwavering, and our friendly team is always ready
              to go the extra mile to exceed your expectations — whether you require a one-time deep
              clean, routine maintenance, or specialised oven cleaning.
            </p>
            <div className="about-checklist">
              {[
                "100% Non-Caustic, Fume-Free & Biodegradable",
                "Appliance safe to use immediately after cleaning",
                "Gentle on enamel, glass seals, and chrome plating",
                "Zero chemical smell or lingering contamination",
              ].map((item, i) => (
                <div key={i} className="about-checklist-item">
                  <CheckCircle2 size={18} color="#2fb8a7" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="about-stats">
        <div className="about-stats-inner">
          {stats.map((s, i) => (
            <div key={i} className="about-stat-item">
              <div className="about-stat-icon">{s.icon}</div>
              <div className="about-stat-val">{s.value}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <section className="about-why">
        <div className="about-why-inner">
          <div className="about-why-header">
            <span className="section-pill">
              <Star size={14} />
              Why Choose Us?
            </span>
            <h2>The Green Clean Difference</h2>
            <p>
              Everything we do is built around your family's safety, your home's wellbeing, and
              your complete peace of mind.
            </p>
          </div>
          <div className="about-why-grid">
            {whyUs.map((card, i) => (
              <div key={i} className="why-card">
                <div className="why-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR LATEST WORK ── */}
      <section className="about-gallery" id="our-latest-work">
        <div className="about-gallery-inner">
          <div className="about-gallery-header">
            <span className="section-pill">📸 Gallery</span>
            <h2>Our Latest Work</h2>
            <p>
              Real results from homes across Liverpool and Merseyside — click any image to view full size.
            </p>
          </div>

          {/* ── Main featured slide ── */}
          <div
            className="gslide-wrap"
            onClick={openLightbox}
            role="button"
            tabIndex={0}
            aria-label={`View ${workImages[slideIndex]?.alt}`}
            onKeyDown={(e) => e.key === "Enter" && openLightbox()}
          >
            {workImages.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                className={`gslide-img${i === slideIndex ? " active" : " exit"}`}
              />
            ))}

            {/* Hover overlay */}
            <div className="gslide-hover-overlay">
              <div className="gslide-expand-icon">🔍</div>
            </div>

            {/* Counter */}
            <div className="gslide-counter">
              {slideIndex + 1} / {workImages.length}
            </div>

            {/* Prev arrow */}
            <button
              className="gslide-arrow prev"
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next arrow */}
            <button
              className="gslide-arrow next"
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* ── Thumbnail strip ── */}
          <div className="gthumb-strip" role="list">
            {workImages.map((img, i) => (
              <div
                key={i}
                className={`gthumb${i === slideIndex ? " active" : ""}`}
                onClick={() => setSlideIndex(i)}
                role="listitem"
                tabIndex={0}
                aria-label={`Select ${img.alt}`}
                onKeyDown={(e) => e.key === "Enter" && setSlideIndex(i)}
              >
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
              <X size={20} />
            </button>
            <div className="lightbox-img-wrap">
              <Image
                src={workImages[slideIndex].src}
                alt={workImages[slideIndex].alt}
                fill
                style={{ objectFit: "contain" }}
                sizes="90vw"
              />
              <button
                className="lightbox-nav lightbox-prev"
                onClick={prevSlide}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className="lightbox-next lightbox-nav"
                onClick={nextSlide}
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            </div>
            <div className="lightbox-counter">
              {slideIndex + 1} / {workImages.length}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA BANNER ── */}
      <section className="about-cta">
        <h2>Ready for a Spotless Clean?</h2>
        <p>
          Join thousands of happy Liverpool households who trust Green Clean Group for a cleaner,
          healthier home.
        </p>
        <Link href="/book" className="btn btn-primary btn-lg" style={{ background: "#fff", color: "#064e3b" }}>
          <Calendar size={18} color="#2fb8a7" />
          Book Your Clean Today
        </Link>
      </section>
    </>
  );
}
