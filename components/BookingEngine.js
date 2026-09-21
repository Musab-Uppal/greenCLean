"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  User,
  CreditCard,
  Sparkles,
  AlertCircle,
  Tag,
  CheckCircle2,
  ShoppingBag,
  Flame,
  UtensilsCrossed,
  Refrigerator,
  Beef,
  Bath,
  Home,
  Printer,
  X,
  Lock,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  UK_TIMEZONE,
  UK_TIME_SLOTS,
  getUkTomorrowDateString,
  getUkDateString,
  formatUkDate,
  normalizeTimeSlot,
} from "@/lib/dateUtils";
import { SERVICE_AREAS } from "@/data/faqsData";

const CATEGORY_ICONS = {
  oven: Flame,
  kitchen: UtensilsCrossed,
  appliances: Refrigerator,
  bbq: Beef,
  bathroom: Bath,
  house: Home,
  tenancy: KeyRound
};

export default function BookingEngine({ initialCategory = "oven", initialCategories = [] }) {
  const { user, login, register } = useAuth();
  const [categories, setCategories] = useState(initialCategories);
  const [step, setStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Auth Prompt Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authShowPassword, setAuthShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetch("/api/services")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCategories(data);
        })
        .catch((err) => console.error("Failed to load booking services:", err));
    }
  }, [initialCategories]);

  // Cart: object of { [itemId]: { ...item, qty: number } }
  const [cart, setCart] = useState({});

  // Step 2: Date & Time (strictly locked to Europe/London - Liverpool, UK)
  const [selectedDate, setSelectedDate] = useState(() => getUkTomorrowDateString());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(UK_TIME_SLOTS[0]);
  const [dateTimeError, setDateTimeError] = useState("");

  // Step 3: Contact Info
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    postcode: ""
  });
  const [formErrors, setFormErrors] = useState({});

  // Step 4: Coupon, Payment & Notes
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("local");
  const [notes, setNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Card Details State
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: ""
  });
  const [cardErrors, setCardErrors] = useState({});

  const getCardBrand = (numStr) => {
    const clean = (numStr || "").replace(/\s/g, "");
    if (clean.startsWith("4")) return { name: "Visa", color: "#1a1f71" };
    if (/^(5[1-5]|2[2-7])/.test(clean)) return { name: "Mastercard", color: "#eb001b" };
    if (/^3[47]/.test(clean)) return { name: "Amex", color: "#006fcf" };
    return { name: "Card", color: "var(--slate-500)" };
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardDetails((prev) => ({ ...prev, number: formatted }));
    if (cardErrors.number) setCardErrors((prev) => ({ ...prev, number: "" }));
  };

  const handleExpiryChange = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) {
      v = v.slice(0, 2) + " / " + v.slice(2);
    }
    setCardDetails((prev) => ({ ...prev, expiry: v }));
    if (cardErrors.expiry) setCardErrors((prev) => ({ ...prev, expiry: "" }));
  };

  const handleCvcChange = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardDetails((prev) => ({ ...prev, cvc: v }));
    if (cardErrors.cvc) setCardErrors((prev) => ({ ...prev, cvc: "" }));
  };

  const validateCard = () => {
    const errors = {};
    const cleanNum = (cardDetails.number || "").replace(/\s/g, "");
    const cleanExp = (cardDetails.expiry || "").replace(/\s/g, "");

    const holder = (cardDetails.name || `${customer.firstName} ${customer.lastName}`).trim();
    if (!holder) {
      errors.name = "Cardholder name is required";
    }

    if (!cleanNum || cleanNum.length < 15) {
      errors.number = "Please enter a valid 15 or 16-digit card number";
    }

    if (!cleanExp || !/^\d{2}\/\d{2}$/.test(cleanExp)) {
      errors.expiry = "Enter valid MM/YY (e.g. 12/28)";
    } else {
      const [m] = cleanExp.split("/").map(Number);
      if (m < 1 || m > 12) {
        errors.expiry = "Invalid month (01-12)";
      }
    }

    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      errors.cvc = "Enter 3 or 4-digit CVC code";
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Confirmation Modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      let loggedUser;
      if (authMode === "login") {
        loggedUser = await login(authEmail, authPassword);
      } else {
        if (!authPhone.trim()) {
          throw new Error("Phone number is required for booking notifications.");
        }
        loggedUser = await register(authEmail, authPhone, authPassword);
      }

      setShowAuthModal(false);
      setCustomer((prev) => ({
        ...prev,
        email: loggedUser.email,
        phone: loggedUser.phone || prev.phone
      }));
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setAuthError(err.message || "Authentication failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Update Cart Quantity
  const updateQty = (item, delta) => {
    setCart((prev) => {
      const currentQty = prev[item.id]?.qty || 0;
      const newQty = currentQty + delta;
      const updated = { ...prev };

      if (newQty <= 0) {
        delete updated[item.id];
      } else {
        updated[item.id] = { ...item, qty: newQty };
      }
      return updated;
    });
  };

  // Calculations
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = appliedDiscount > 0 ? (subtotal * appliedDiscount) / 100 : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const meetsMinimum = subtotal >= 50;

  // Coupon handling
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponCode.trim().toUpperCase();
    if (code === "ECO10") {
      setAppliedDiscount(10);
      setCouponSuccess("Success! 10% Eco discount applied.");
    } else if (code === "LIVERPOOL5" || code === "CLEAN5") {
      setAppliedDiscount(5);
      setCouponSuccess("Success! 5% local loyalty discount applied.");
    } else {
      setCouponError("Invalid coupon code. Try 'ECO10' for 10% off!");
    }
  };

  // Validation
  const validateStep3 = () => {
    const errors = {};
    if (!customer.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!customer.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    const phoneVal = (customer.phone || user?.phone || "").trim();
    const emailVal = (customer.email || user?.email || "").trim();

    if (!phoneVal) {
      errors.phone = "Phone number is required";
    } else if (phoneVal.replace(/[\s\-()]/g, "").length < 10) {
      errors.phone = "Please enter a valid UK phone number";
    }
    if (!emailVal || !emailVal.includes("@") || !emailVal.includes(".")) {
      errors.email = "Please provide a valid email address";
    }
    if (!customer.address.trim()) {
      errors.address = "Street address is required";
    }

    // 40-mile Liverpool & North West coverage validation
    const cleanPostcode = (customer.postcode || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!cleanPostcode) {
      errors.postcode = "Postcode is required";
    } else if (cleanPostcode.length < 3) {
      errors.postcode = "Please enter a valid UK postcode";
    } else {
      // Check whether it falls within our core 40-mile service routes
      const isDirectlyCovered = SERVICE_AREAS.some((area) =>
        area.postcodes.some((p) => cleanPostcode.startsWith(p))
      );
      if (!isDirectlyCovered) {
        // Extended North West UK prefixes within/near Liverpool 40-mile radius
        const extended40Miles = ["L", "CH", "WA", "WN", "PR", "M", "BL", "SK", "CW", "FY", "BB", "LL"];
        const matchPrefix = cleanPostcode.match(/^([A-Z]{1,2})/);
        const prefixArea = matchPrefix ? matchPrefix[1] : "";
        if (!extended40Miles.includes(prefixArea)) {
          errors.postcode = "We only service within a 40-mile radius of Liverpool. Call 07359 068284 to check special dispatch availability.";
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    // Fail-safe 1: Must always have items and meet the £50 minimum order threshold
    if (cartItems.length === 0 || subtotal < 50) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (step === 1) {
      if (!meetsMinimum) return;
      // Prompt customer to log in before proceeding to select date/time
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2) {
      if (!selectedDate || !selectedTimeSlot) {
        setDateTimeError("Please select both an appointment date and an arrival time window.");
        return;
      }
      setDateTimeError("");
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 3) {
      if (validateStep3()) {
        // Pre-fill cardholder name if empty
        if (!cardDetails.name && customer.firstName) {
          setCardDetails((prev) => ({
            ...prev,
            name: `${customer.firstName} ${customer.lastName}`.trim()
          }));
        }
        setStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (step === 4) {
      // For Stripe (creditcard), no local card validation needed — Stripe hosts the card form
      if (!agreeTerms) {
        setTermsError(true);
        return;
      }
      setTermsError(false);
      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalConfirm = async () => {
    // Zero-loophole fail-safe: Validate every single prior step before confirming
    if (cartItems.length === 0 || subtotal < 50) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!selectedDate || !selectedTimeSlot) {
      setDateTimeError("Please select both an appointment date and an arrival time window.");
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!validateStep3()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!agreeTerms) {
      setTermsError(true);
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setCheckoutError("");

    // Option B: Online Payment — redirect to Stripe Checkout
    if (paymentMethod === "creditcard") {
      setCheckoutLoading(true);
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              id: item.id,
              db_id: item.db_id,
              name: item.name,
              price: item.price,
              qty: item.qty,
              duration: item.duration
            })),
            customer: {
              firstName: customer.firstName || user?.firstName || "",
              lastName: customer.lastName || user?.lastName || "",
              email: customer.email || user?.email,
              phone: customer.phone || user?.phone,
              address: customer.address,
              postcode: customer.postcode
            },
            scheduledDate: selectedDate,
            selectedTimeSlot,
            notes,
            discountPercent: appliedDiscount,
            totalAmount: total
          })
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to create Stripe checkout session.");
        }

        if (data.url) {
          // Redirect user to Stripe-hosted payment page
          window.location.href = data.url;
        } else {
          throw new Error("No checkout URL returned from Stripe.");
        }
      } catch (err) {
        console.error("Stripe checkout error:", err);
        setCheckoutError(err.message || "Unable to connect to payment gateway. Please try again.");
        setCheckoutLoading(false);
      }
      return;
    }

    // Option A: Pay Locally (Cash or Card upon arrival)
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setBookingRef(`GCG-${randomNum}`);
    setShowConfirmation(true);

    // Persist order and customer to SQLite database
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customer.email || user?.email,
        phone: customer.phone || user?.phone,
        address: `${customer.address}, ${customer.postcode}`,
        phoneno: customer.phone || user?.phone,
        items: cartItems.map((item) => ({ id: item.id, db_id: item.db_id, name: item.name, price: item.price })),
        scheduled_date: `${selectedDate} ${selectedTimeSlot}`,
        status: "confirmed",
        payment_method: "local",
        payment_status: "pending",
        total_amount: total
      })
    }).catch((err) => console.error("Failed to persist booking to database:", err));
  };

  // Available upcoming 14 days strictly locked to Europe/London (Liverpool, UK)
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setTime(d.getTime() + i * 24 * 60 * 60 * 1000);
      const ukDate = getUkDateString(d);
      dates.push({
        full: ukDate,
        dayName: d.toLocaleDateString("en-GB", { timeZone: UK_TIMEZONE, weekday: "short" }),
        dayNum: parseInt(new Intl.DateTimeFormat("en-GB", { timeZone: UK_TIMEZONE, day: "numeric" }).format(d), 10),
        month: d.toLocaleDateString("en-GB", { timeZone: UK_TIMEZONE, month: "short" })
      });
    }
    return dates;
  };

  return (
    <div style={{ position: "relative" }}>
      {/* 5-Step Progress Stepper */}
      <div className="booking-stepper-wrap">
        <div className="stepper-progress-bar">
          <div
            className="stepper-progress-fill"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />
        </div>

        {[
          { num: 1, label: "1. Services" },
          { num: 2, label: "2. Date & Time" },
          { num: 3, label: "3. Contacts" },
          { num: 4, label: "4. Payment" },
          { num: 5, label: "5. Review" }
        ].map((node) => (
          <button
            type="button"
            key={node.num}
            className={`step-node ${step === node.num ? "active" : ""} ${step > node.num ? "completed" : ""}`}
            onClick={() => {
              if (step > node.num) setStep(node.num);
            }}
            disabled={step <= node.num}
            style={{
              cursor: step > node.num ? "pointer" : "default",
              border: "none",
              background: "transparent",
              padding: 0
            }}
            aria-label={`Step ${node.num}: ${node.label}`}
          >
            <div className="step-node-bubble">
              {step > node.num ? <Check size={18} /> : node.num}
            </div>
            <span className="step-node-label">{node.label}</span>
          </button>
        ))}
      </div>

      {/* Category selector pills (Full Width above Main Grid) */}
      {step === 1 && (
        <div style={{ marginBottom: "24px", width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: "6px" }}>
          <div style={{ display: "flex", gap: "8px", width: "max-content", minWidth: "100%" }}>
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Sparkles;
              const isActive = activeCategory === cat.id;
              const countInCat = cat.items?.reduce((acc, it) => acc + (cart[it.id]?.qty || 0), 0) || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "9px 16px",
                    borderRadius: "var(--radius-full)",
                    background: isActive ? "var(--emerald-600)" : "#ffffff",
                    color: isActive ? "#ffffff" : "var(--slate-700)",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    border: `1.5px solid ${isActive ? "var(--emerald-600)" : "var(--slate-200)"}`,
                    boxShadow: isActive ? "var(--shadow-green-sm)" : "var(--shadow-sm)",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s"
                  }}
                >
                  <Icon size={15} />
                  <span>{cat.title}</span>
                  {countInCat > 0 && (
                    <span style={{
                      background: isActive ? "#ffffff" : "var(--emerald-600)",
                      color: isActive ? "var(--emerald-700)" : "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: "800",
                      padding: "2px 7px",
                      borderRadius: "var(--radius-full)"
                    }}>
                      {countInCat}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Wizard Form on Left, Sticky Cart on Right */}
      <div className="booking-main-grid">
        <div className="booking-form-col">

          {/* ================================================================
              STEP 1: SELECT SERVICES
             ================================================================ */}
          {step === 1 && (
            <div>
              {/* Items for selected category */}
              {categories.filter(c => c.id === activeCategory).map((cat) => (
                <div key={cat.id}>
                  <div style={{ marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "4px" }}>
                      {cat.title} Options
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--slate-500)", lineHeight: "1.5" }}>
                      {cat.shortDesc}
                    </p>
                  </div>

                  <div className="service-booking-grid">
                    {cat.items.map((item) => {
                      const qty = cart[item.id]?.qty || 0;
                      return (
                        <div
                          key={item.id}
                          className={`booking-item-card ${qty > 0 ? "has-quantity" : ""}`}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px", flexWrap: "wrap" }}>
                              <h4 style={{ fontWeight: "700", fontSize: "0.95rem", color: "var(--slate-900)", lineHeight: 1.3 }}>
                                {item.name}
                              </h4>
                              {item.popular && (
                                <span style={{
                                  fontSize: "0.65rem",
                                  fontWeight: "700",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background: "var(--emerald-100)",
                                  color: "var(--emerald-800)"
                                }}>
                                  Popular
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: "0.78rem", color: "var(--slate-500)", display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                              {item.width && <span>📐 {item.width}</span>}
                              {item.duration && <span>⏱️ {item.duration}</span>}
                            </div>

                            <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "var(--emerald-700)" }}>
                              £{item.price}
                            </div>
                          </div>

                          {/* Counter */}
                          <div className="qty-control">
                            <button
                              type="button"
                              onClick={() => updateQty(item, -1)}
                              disabled={qty === 0}
                              className="qty-btn"
                              aria-label={`Decrease ${item.name}`}
                              style={{ opacity: qty === 0 ? 0.35 : 1 }}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="qty-number">{qty}</span>
                            <button
                              type="button"
                              onClick={() => updateQty(item, 1)}
                              className="qty-btn"
                              aria-label={`Increase ${item.name}`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================================================================
              STEP 2: CHOOSE DATE & TIME
             ================================================================ */}
          {step === 2 && (
            <div className="glass-card responsive-card-padding">
              <div style={{ marginBottom: "28px" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "6px" }}>
                  Select Your Preferred Date
                </h3>
                <p style={{ color: "var(--slate-600)", fontSize: "0.925rem" }}>
                  Technicians operate 7 days a week across Liverpool and Merseyside.
                </p>
              </div>

              {/* Date Pills Slider */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                gap: "10px",
                marginBottom: "32px"
              }}>
                {getAvailableDates().map((d) => {
                  const isSelected = selectedDate === d.full;
                  return (
                    <button
                      key={d.full}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d.full);
                        setDateTimeError("");
                      }}
                      style={{
                        padding: "12px 8px",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${isSelected ? "var(--emerald-600)" : "var(--slate-200)"}`,
                        background: isSelected ? "var(--emerald-600)" : "#ffffff",
                        color: isSelected ? "#ffffff" : "var(--slate-800)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "600", opacity: isSelected ? 0.9 : 0.6 }}>
                        {d.dayName}
                      </span>
                      <span style={{ fontSize: "1.3rem", fontWeight: "800" }}>
                        {d.dayNum}
                      </span>
                      <span style={{ fontSize: "0.75rem", opacity: isSelected ? 0.9 : 0.6 }}>
                        {d.month}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "6px" }}>
                  Select Arrival Time Slot
                </h3>
                <p style={{ color: "var(--slate-600)", fontSize: "0.925rem" }}>
                  Our cleaner will arrive within this designated arrival window.
                </p>
              </div>

              <div className="time-slots-grid">
                {UK_TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedTimeSlot(slot);
                        setDateTimeError("");
                      }}
                      className={`time-slot-btn ${isSelected ? "selected" : ""}`}
                    >
                      <Clock size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>

              {dateTimeError && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--danger-50)",
                  color: "var(--danger-500)",
                  fontSize: "0.875rem",
                  marginTop: "20px",
                  fontWeight: "600",
                  border: "1px solid rgba(239, 68, 68, 0.2)"
                }}>
                  <AlertCircle size={18} />
                  <span>{dateTimeError}</span>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              STEP 3: CONTACT & ADDRESS
             ================================================================ */}
          {step === 3 && (
            <div className="glass-card responsive-card-padding">
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "6px" }}>
                  Your Contact &amp; Property Details
                </h3>
                <p style={{ color: "var(--slate-600)", fontSize: "0.925rem" }}>
                  We’ll send instant SMS and email confirmation and technician arrival notifications.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      value={customer.firstName}
                      onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                      placeholder="e.g. John"
                      className="form-input"
                    />
                    {formErrors.firstName && <span style={{ color: "var(--danger-500)", fontSize: "0.8rem" }}>{formErrors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      value={customer.lastName}
                      onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                      placeholder="e.g. Smith"
                      className="form-input"
                    />
                    {formErrors.lastName && <span style={{ color: "var(--danger-500)", fontSize: "0.8rem" }}>{formErrors.lastName}</span>}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      value={customer.phone !== "" ? customer.phone : (user?.phone || "")}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="e.g. 07359068284"
                      className="form-input"
                    />
                    {formErrors.phone && <span style={{ color: "var(--danger-500)", fontSize: "0.8rem" }}>{formErrors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      value={customer.email !== "" ? customer.email : (user?.email || "")}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="form-input"
                    />
                    {formErrors.email && <span style={{ color: "var(--danger-500)", fontSize: "0.8rem" }}>{formErrors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="e.g. 24 Dale Street, Apt 3B"
                    className="form-input"
                  />
                  {formErrors.address && <span style={{ color: "var(--danger-500)", fontSize: "0.8rem" }}>{formErrors.address}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Postcode (Liverpool / Merseyside) *</label>
                  <input
                    type="text"
                    value={customer.postcode}
                    onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
                    placeholder="e.g. L2 5ST"
                    className="form-input"
                    style={{ maxWidth: "200px" }}
                  />
                  {formErrors.postcode && <span style={{ color: "var(--danger-500)", fontSize: "0.8rem" }}>{formErrors.postcode}</span>}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 4: PAYMENT & NOTES
             ================================================================ */}
          {step === 4 && (
            <div className="glass-card responsive-card-padding">
              {/* Coupon input */}
              <div style={{ marginBottom: "32px", padding: "20px", background: "var(--emerald-50)", borderRadius: "var(--radius-md)", border: "1px dashed var(--emerald-300)" }}>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Tag size={16} color="#059669" />
                  <span>Have a promo code? (Try: ECO10)</span>
                </label>
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="form-input"
                    style={{ textTransform: "uppercase" }}
                  />
                  <button type="button" onClick={handleApplyCoupon} className="btn btn-secondary">
                    Apply
                  </button>
                </div>
                {couponError && <p style={{ color: "var(--danger-500)", fontSize: "0.85rem", marginTop: "6px" }}>{couponError}</p>}
                {couponSuccess && <p style={{ color: "var(--emerald-700)", fontWeight: "600", fontSize: "0.85rem", marginTop: "6px" }}>{couponSuccess}</p>}
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "14px" }}>
                  Choose Your Payment Method:
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { 
                      id: "local", 
                      title: "I will pay locally (cash or credit card)", 
                      desc: "Pay directly to the cleaner upon arrival via Cash or Card terminal once work is completed.", 
                      badge: "Pay on Arrival" 
                    },
                    { 
                      id: "creditcard", 
                      title: "I will pay now with credit card", 
                      desc: "Secure online payment with Credit / Debit Card (Visa, Mastercard, etc.) processed via Stripe UK in GBP (£).", 
                      badge: "Stripe Online" 
                    }
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "14px",
                        padding: "16px 18px",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${paymentMethod === pm.id ? "var(--emerald-600)" : "var(--slate-200)"}`,
                        background: paymentMethod === pm.id ? "var(--emerald-50)" : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ marginTop: "4px", accentColor: "var(--emerald-600)", width: "18px", height: "18px" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: "700", color: "var(--slate-900)" }}>{pm.title}</span>
                          {pm.badge && (
                            <span style={{ fontSize: "0.7rem", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", background: "var(--emerald-200)", color: "var(--emerald-800)" }}>
                              {pm.badge}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: "0.85rem", color: "var(--slate-500)", display: "block", marginTop: "2px" }}>{pm.desc}</span>
                        {pm.id === "creditcard" && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", fontSize: "0.75rem", color: "var(--emerald-700)", fontWeight: "600" }}>
                            <span>🔒 256-bit SSL Encrypted</span>
                            <span>•</span>
                            <span>Visa &amp; Mastercard</span>
                          </div>
                        )}

                        {/* Stripe redirect info box */}
                        {pm.id === "creditcard" && paymentMethod === "creditcard" && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              marginTop: "16px",
                              padding: "16px 18px",
                              background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                              borderRadius: "var(--radius-md)",
                              border: "1.5px solid var(--emerald-300)",
                              boxShadow: "var(--shadow-sm)"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                              <Lock size={16} style={{ color: "var(--emerald-600)", flexShrink: 0 }} />
                              <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--emerald-800)" }}>
                                Secure Stripe Checkout
                              </span>
                            </div>
                            <p style={{ fontSize: "0.82rem", color: "var(--slate-600)", margin: "0 0 10px 0", lineHeight: 1.5 }}>
                              After reviewing your booking, you&apos;ll be securely redirected to
                              Stripe&apos;s hosted payment page to enter your card details.
                              Your card information is never stored on our servers.
                            </p>
                            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "0.72rem", fontWeight: "800", color: "#1a1f71", background: "#f0f4ff", padding: "3px 8px", borderRadius: "4px", border: "1px solid #c7d2fe" }}>VISA</span>
                              <span style={{ fontSize: "0.72rem", fontWeight: "800", color: "#eb001b", background: "#fff1f0", padding: "3px 8px", borderRadius: "4px", border: "1px solid #fecaca" }}>MASTERCARD</span>
                              <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--emerald-700)", background: "var(--emerald-50)", padding: "3px 8px", borderRadius: "4px" }}>🔒 Stripe Secured · GBP £</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              <div className="form-group" style={{ marginBottom: "28px" }}>
                <label className="form-label">Any specific parking or access notes for the cleaner?</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Key safe code, park in driveway, beware of friendly golden retriever..."
                  className="form-textarea"
                />
              </div>

              {/* Agreement */}
              <div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (e.target.checked) setTermsError(false);
                    }}
                    style={{ marginTop: "4px", accentColor: "var(--emerald-600)", width: "18px", height: "18px" }}
                  />
                  <span style={{ fontSize: "0.875rem", color: "var(--slate-700)" }}>
                    I have read and agree with Green Clean Group&apos;s{" "}
                    <Link href="/terms-and-conditions" style={{ color: "var(--emerald-700)", textDecoration: "underline", fontWeight: "600" }}>
                      Terms &amp; Conditions
                    </Link>{" "}
                    and 100% Satisfaction Guarantee.
                  </span>
                </label>
                {termsError && (
                  <p style={{ color: "var(--danger-500)", fontSize: "0.8rem", marginTop: "6px" }}>
                    Please agree to the Terms &amp; Conditions to continue.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 5: SUMMARY & CONFIRMATION
             ================================================================ */}
          {step === 5 && (
            <div className="glass-card responsive-card-padding">
              <h3 style={{ fontSize: "1.45rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "24px" }}>
                Please Review Your Booking
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
                {/* 1. Services */}
                <div style={{ padding: "18px", borderRadius: "var(--radius-md)", background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontWeight: "700", color: "var(--slate-900)" }}>1. Selected Services ({cartItems.length})</span>
                    <button type="button" onClick={() => setStep(1)} style={{ color: "var(--emerald-600)", fontWeight: "600", fontSize: "0.85rem" }}>
                      Edit
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {cartItems.map((it) => (
                      <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                        <span>{it.qty} × {it.name}</span>
                        <span style={{ fontWeight: "700" }}>£{it.price * it.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Date & Time */}
                <div style={{ padding: "18px", borderRadius: "var(--radius-md)", background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "700", color: "var(--slate-900)" }}>2. Appointment Date &amp; Time</span>
                    <button type="button" onClick={() => setStep(2)} style={{ color: "var(--emerald-600)", fontWeight: "600", fontSize: "0.85rem" }}>
                      Edit
                    </button>
                  </div>
                  <p style={{ fontSize: "0.95rem", color: "var(--emerald-800)", fontWeight: "600" }}>
                    📅 {formatUkDate(selectedDate, true)} | ⏰ {selectedTimeSlot}
                  </p>
                </div>

                {/* 3. Contact & Address */}
                <div style={{ padding: "18px", borderRadius: "var(--radius-md)", background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "700", color: "var(--slate-900)" }}>3. Customer Details</span>
                    <button type="button" onClick={() => setStep(3)} style={{ color: "var(--emerald-600)", fontWeight: "600", fontSize: "0.85rem" }}>
                      Edit
                    </button>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--slate-700)", lineHeight: "1.6" }}>
                    <strong>{customer.firstName} {customer.lastName}</strong><br />
                    📞 {customer.phone} | ✉️ {customer.email}<br />
                    📍 {customer.address}, {customer.postcode}
                  </p>
                </div>

                {/* 4. Payment */}
                <div style={{ padding: "18px", borderRadius: "var(--radius-md)", background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "700", color: "var(--slate-900)" }}>4. Payment &amp; Notes</span>
                    <button type="button" onClick={() => setStep(4)} style={{ color: "var(--emerald-600)", fontWeight: "600", fontSize: "0.85rem" }}>
                      Edit
                    </button>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--slate-700)" }}>
                    Payment Method: <strong>
                      {paymentMethod === "local" 
                        ? "Pay Locally (Cash or Card upon arrival)" 
                        : "Online via Stripe (Visa / Mastercard · GBP £)"}
                    </strong><br />
                    {paymentMethod === "creditcard" && (
                      <span style={{ fontSize: "0.82rem", color: "var(--emerald-700)" }}>
                        🔒 You will be redirected to Stripe to complete payment securely.
                      </span>
                    )}
                    {notes && <><br /><span>Notes: <em>&ldquo;{notes}&rdquo;</em></span></>}
                  </p>
                </div>
              </div>

              {checkoutError && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--danger-50)",
                  color: "var(--danger-500)",
                  fontSize: "0.875rem",
                  marginBottom: "16px",
                  fontWeight: "600",
                  border: "1px solid rgba(239, 68, 68, 0.2)"
                }}>
                  <AlertCircle size={18} />
                  <span>{checkoutError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleFinalConfirm}
                disabled={checkoutLoading}
                className="btn btn-primary btn-lg"
                style={{ width: "100%", fontSize: "1.15rem", opacity: checkoutLoading ? 0.7 : 1 }}
              >
                {checkoutLoading ? (
                  <>
                    <div className="spinner" style={{ width: "18px", height: "18px", border: "2px solid #ffffff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", display: "inline-block", marginRight: "8px" }} />
                    <span>Redirecting to Stripe Secure Checkout...</span>
                  </>
                ) : paymentMethod === "creditcard" ? (
                  <>
                    <Lock size={18} />
                    <span>Continue to Secure Payment · £{total.toFixed(2)}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Confirm &amp; Place Booking (£{total.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Navigation Controls (Back) */}
          {step > 1 && step < 5 && (
            <div style={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn btn-secondary"
              >
                <ChevronLeft size={16} />
                <span>Back to Step {step - 1}</span>
              </button>
            </div>
          )}
        </div>

        {/* ================================================================
            STICKY CART / ORDER SUMMARY SIDEBAR
           ================================================================ */}
        <div className="booking-sidebar-col">
          <div className="sticky-summary-card">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid var(--slate-200)" }}>
              <ShoppingBag size={20} color="#059669" />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--slate-900)" }}>
                Booking Summary
              </h3>
            </div>

            {cartItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--slate-500)" }}>
                <Sparkles size={32} color="#10b981" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                <p style={{ fontSize: "0.95rem", fontWeight: "600" }}>Your basket is empty</p>
                <p style={{ fontSize: "0.825rem", marginTop: "4px" }}>Select cleaning services to start building your quote.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px", marginBottom: "18px" }}>
                  {cartItems.map((it) => (
                    <div key={it.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <div>
                        <div style={{ fontWeight: "600", color: "var(--slate-800)" }}>{it.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>Qty: {it.qty} × £{it.price}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: "700", color: "var(--slate-900)" }}>£{it.price * it.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(it, -it.qty)}
                          style={{ color: "var(--slate-400)", padding: "2px" }}
                          aria-label={`Remove ${it.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid var(--slate-200)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--slate-600)" }}>
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--emerald-600)", fontWeight: "600" }}>
                      <span>Eco Promo ({appliedDiscount}%)</span>
                      <span>-£{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: "800", color: "var(--slate-900)", paddingTop: "8px", borderTop: "1px dashed var(--slate-200)" }}>
                    <span>Total</span>
                    <span style={{ color: "var(--emerald-700)" }}>£{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Minimum Order Notice */}
                {!meetsMinimum && (
                  <div style={{ marginTop: "16px", padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--danger-50)", border: "1px solid #fca5a5", display: "flex", alignItems: "center", gap: "8px", color: "#991b1b", fontSize: "0.825rem" }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>Minimum order value is <strong>£50.00</strong>. (Add £{(50 - subtotal).toFixed(2)} more)</span>
                  </div>
                )}


              </div>
            )}

            {/* Action Button: Directly Below Summary */}
            {step < 5 && (
              <div style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={step === 1 && !meetsMinimum}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: (step === 1 && !meetsMinimum) ? 0.5 : 1,
                    cursor: (step === 1 && !meetsMinimum) ? "not-allowed" : "pointer"
                  }}
                >
                  <span>Continue to Step {step + 1}</span>
                  <ChevronRight size={18} />
                </button>
                {step === 1 && !meetsMinimum && (
                  <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--slate-500)", marginTop: "8px" }}>
                    Select services (£50 min order) to proceed
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================
          CONFIRMATION MODAL
         ================================================================ */}
      {showConfirmation && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div
            className="glass-card"
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "40px 32px",
              textAlign: "center",
              background: "#ffffff",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              animation: "dropdownFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              position: "relative"
            }}
          >
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              aria-label="Close confirmation"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "var(--slate-100)",
                color: "var(--slate-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <X size={18} />
            </button>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--emerald-100)",
              color: "var(--emerald-600)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px"
            }}>
              <CheckCircle2 size={44} />
            </div>

            <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--emerald-600)" }}>
              Booking Confirmed
            </span>
            <h2 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--slate-900)", margin: "8px 0 12px" }}>
              Thank you, {customer.firstName}!
            </h2>
            <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
              Your eco-friendly cleaning appointment has been scheduled. A confirmation summary has been dispatched to <strong>{customer.email}</strong>.
            </p>

            <div style={{ padding: "16px", borderRadius: "var(--radius-md)", background: "var(--slate-50)", border: "1px solid var(--slate-200)", textAlign: "left", fontSize: "0.875rem", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "var(--slate-500)" }}>Booking Reference:</span>
                <strong style={{ color: "var(--emerald-700)" }}>{bookingRef}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "var(--slate-500)" }}>Date &amp; Slot:</span>
                <strong>{formatUkDate(selectedDate, true)} ({selectedTimeSlot})</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "var(--slate-500)" }}>Total Amount:</span>
                <strong style={{ fontSize: "1rem", color: "var(--slate-900)" }}>£{total.toFixed(2)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--slate-500)" }}>Payment:</span>
                <strong style={{ color: paymentMethod === "creditcard" ? "var(--emerald-700)" : "var(--slate-800)" }}>
                  {paymentMethod === "creditcard"
                    ? "Online via Stripe (GBP £)"
                    : "Pay locally (cash or card upon arrival)"}
                </strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-secondary btn-sm"
              >
                <Printer size={15} />
                <span>Print Receipt</span>
              </button>
              <Link
                href="/"
                className="btn btn-primary btn-sm"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal when wanting to book a service */}
      {showAuthModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="glass-card" style={{
            background: "#ffffff",
            maxWidth: "460px",
            width: "100%",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            padding: "32px",
            position: "relative",
            border: "1.5px solid var(--emerald-200)"
          }}>
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "var(--slate-100)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--slate-600)"
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "var(--emerald-100)",
                color: "var(--emerald-700)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px"
              }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: "1.45rem", fontWeight: "850", color: "var(--slate-900)", marginBottom: "4px" }}>
                {authMode === "login" ? "Sign In to Book" : "Create Account"}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--slate-500)", lineHeight: "1.5" }}>
                Sign in to secure your arrival slot. Your selected services ({cartItems.length}) are saved in your cart.
              </p>
            </div>

            <div style={{
              display: "flex",
              background: "var(--slate-100)",
              borderRadius: "var(--radius-full)",
              padding: "4px",
              marginBottom: "18px"
            }}>
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setAuthError(""); }}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  background: authMode === "login" ? "#ffffff" : "transparent",
                  color: authMode === "login" ? "var(--emerald-700)" : "var(--slate-600)",
                  boxShadow: authMode === "login" ? "var(--shadow-sm)" : "none",
                  transition: "all 0.2s"
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("register"); setAuthError(""); }}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  background: authMode === "register" ? "#ffffff" : "transparent",
                  color: authMode === "register" ? "var(--emerald-700)" : "var(--slate-600)",
                  boxShadow: authMode === "register" ? "var(--shadow-sm)" : "none",
                  transition: "all 0.2s"
                }}
              >
                New Customer?
              </button>
            </div>

            {authError && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                background: "var(--danger-50)",
                color: "var(--danger-500)",
                fontSize: "0.85rem",
                fontWeight: "600",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                marginBottom: "16px"
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.825rem" }}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.co.uk"
                  className="form-input"
                  style={{ padding: "10px 12px" }}
                  autoComplete="email"
                />
              </div>

              {authMode === "register" && (
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.825rem" }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="e.g. 07359068284"
                    className="form-input"
                    style={{ padding: "10px 12px" }}
                    autoComplete="tel"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.825rem" }}>Password *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={authShowPassword ? "text" : "password"}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder={authMode === "login" ? "Enter your password" : "At least 6 characters"}
                    className="form-input"
                    style={{ padding: "10px 12px", paddingRight: "36px" }}
                    autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setAuthShowPassword(!authShowPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--slate-400)"
                    }}
                  >
                    {authShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "6px", padding: "11px" }}
              >
                <span>{authLoading ? "Authenticating..." : authMode === "login" ? "Sign In & Continue" : "Create Account & Continue"}</span>
                <ChevronRight size={16} />
              </button>

              <div style={{ textAlign: "center", marginTop: "6px" }}>
                <Link
                  href={`/login?redirect=${encodeURIComponent("/book")}`}
                  style={{ fontSize: "0.8rem", color: "var(--slate-500)", textDecoration: "underline" }}
                >
                  Open full login page in separate tab
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
