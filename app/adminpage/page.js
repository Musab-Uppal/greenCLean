"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

const CATEGORY_IMAGE_PRESETS = [
  { label: "Oven", path: "/services/oven.jpg" },
  { label: "Kitchen", path: "/services/kitchen.jpg" },
  { label: "Appliances", path: "/services/appliances.jpg" },
  { label: "BBQ", path: "/services/bbq.jpg" },
  { label: "Bathroom", path: "/services/bathroom.jpg" },
  { label: "House", path: "/services/house.jpg" },
  { label: "Tenancy", path: "/services/tenancy.jpg" },
];

export default function AdminPage() {
  // Authentication states
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Navigation tab state: 'orders' | 'categories' | 'services'
  const [activeTab, setActiveTab] = useState("orders");

  // Data states
  const [dataLoading, setDataLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [kpis, setKpis] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingCount: 0,
    confirmedCount: 0,
    completedCount: 0,
    cancelledCount: 0,
  });

  // UI feedback alert
  const [feedback, setFeedback] = useState(null);

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Category modals/form
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState("/services/oven.jpg");
  const [editingCategory, setEditingCategory] = useState(null);
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Service modals/form
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category_id: "",
    price: "",
    time: "2 Hours",
    width: "",
  });
  const [editingService, setEditingService] = useState(null);
  const [serviceActionLoading, setServiceActionLoading] = useState(false);
  const [serviceCatFilter, setServiceCatFilter] = useState("all");
  const [serviceSearch, setServiceSearch] = useState("");
  // Staged / Pending Changes State for Header "Save Changes" Button
  const [pendingOrders, setPendingOrders] = useState({});
  const [pendingServices, setPendingServices] = useState({});
  const [pendingCategories, setPendingCategories] = useState({});
  const [savingChanges, setSavingChanges] = useState(false);

  const totalPendingCount = useMemo(() => {
    return (
      Object.keys(pendingOrders).length +
      Object.keys(pendingServices).length +
      Object.keys(pendingCategories).length
    );
  }, [pendingOrders, pendingServices, pendingCategories]);

  const showNotification = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // 1. Check session on mount
  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    setAuthChecking(true);
    try {
      const res = await fetch("/api/admin/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAdminUsername(data.user || "admin");
          fetchAdminData();
          return;
        }
      }
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const fetchAdminData = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setCategories(data.categories || []);
        setServices(data.services || []);
        if (data.kpis) setKpis(data.kpis);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showNotification("error", "Failed to fetch dashboard data.");
    } finally {
      setDataLoading(false);
    }
  };

  // 2. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Authentication failed.");
        setLoginLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setAdminUsername(data.user || "admin");
      setPasswordInput("");
      fetchAdminData();
    } catch {
      setLoginError("Connection error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // 3. Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setOrders([]);
      setCategories([]);
      setServices([]);
    }
  };

  // 4. Order Management Actions (Staged for Header "Save Changes")
  const handleStageOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
    );
    setPendingOrders((prev) => ({
      ...prev,
      [orderId]: { ...(prev[orderId] || {}), status: newStatus },
    }));
  };

  // 4b. Category File Upload Handler
  const handleCategoryFileUpload = async (file, isEdit = false) => {
    if (!file) return;
    setUploadingImage(true);

    // 1. Instant local preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (isEdit) {
        setEditingCategory((prev) => (prev ? { ...prev, image: ev.target.result } : null));
      } else {
        setNewCatImage(ev.target.result);
      }
    };
    reader.readAsDataURL(file);

    // 2. Upload file to server
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (isEdit) {
          setEditingCategory((prev) => (prev ? { ...prev, image: data.url } : null));
        } else {
          setNewCatImage(data.url);
        }
        showNotification("success", "Picture uploaded successfully.");
      } else {
        showNotification("error", data.error || "Failed to upload image.");
      }
    } catch {
      showNotification("error", "Failed to upload image to server.");
    } finally {
      setUploadingImage(false);
    }
  };

  // 5. Category Management Actions
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showNotification("error", "Category name is required.");
      return;
    }
    if (!newCatImage || !newCatImage.trim()) {
      showNotification("error", "A category picture is required. Please select an image.");
      return;
    }
    setCatActionLoading(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), image: newCatImage.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        showNotification("success", "Category created successfully.");
        setNewCatName("");
        setNewCatImage("/services/oven.jpg");
        setShowAddCategoryModal(false);
        fetchAdminData();
      } else {
        showNotification("error", data.error || "Failed to create category.");
      }
    } catch {
      showNotification("error", "Failed to communicate with server.");
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleStageCategoryEdit = (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;
    if (!editingCategory.image || !editingCategory.image.trim()) {
      showNotification("error", "Category picture is required.");
      return;
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === editingCategory.id ? { ...c, ...editingCategory } : c))
    );
    setPendingCategories((prev) => ({
      ...prev,
      [editingCategory.id]: {
        name: editingCategory.name.trim(),
        image: editingCategory.image.trim(),
      },
    }));
    setEditingCategory(null);
    showNotification("success", `Category #${editingCategory.id} edits staged. Click "Save Changes" in header to save.`);
  };

  const handleDeleteCategory = async (categoryId, serviceCount) => {
    if (serviceCount > 0) {
      alert(`Cannot delete this category because ${serviceCount} service(s) are assigned to it. Reassign or delete those services first.`);
      return;
    }
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("success", "Category deleted.");
        fetchAdminData();
      } else {
        showNotification("error", data.error || "Failed to delete.");
      }
    } catch {
      showNotification("error", "Failed to delete category.");
    }
  };

  // 6. Service Management Actions
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.category_id || !serviceForm.price) return;
    setServiceActionLoading(true);

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm),
      });
      const data = await res.json();

      if (res.ok) {
        showNotification("success", "Service product added successfully.");
        setServiceForm({
          name: "",
          category_id: "",
          price: "",
          time: "2 Hours",
          width: "",
        });
        setShowAddServiceModal(false);
        fetchAdminData();
      } else {
        showNotification("error", data.error || "Failed to add service.");
      }
    } catch {
      showNotification("error", "Failed to communicate with server.");
    } finally {
      setServiceActionLoading(false);
    }
  };

  const handleStageServiceEdit = (e) => {
    e.preventDefault();
    if (!editingService) return;
    
    setServices((prev) =>
      prev.map((s) => (s.id === editingService.id ? { ...s, ...editingService } : s))
    );
    setPendingServices((prev) => ({
      ...prev,
      [editingService.id]: {
        name: editingService.name,
        category_id: editingService.category_id,
        price: parseFloat(editingService.price),
        time: editingService.time,
        width: editingService.width,
      },
    }));
    setEditingService(null);
    showNotification("success", `Service #${editingService.id} edits staged. Click "Save Changes" in header to save.`);
  };

  const handleStageServicePrice = (serviceId, newPrice) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, price: newPrice } : s))
    );
    const parsed = parseFloat(newPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      setPendingServices((prev) => ({
        ...prev,
        [serviceId]: { ...(prev[serviceId] || {}), price: parsed },
      }));
    }
  };

  // Master Save Changes Function: Commits all pending modifications to Database
  const handleSaveChanges = async () => {
    if (totalPendingCount === 0) {
      showNotification("success", "No unsaved changes.");
      return;
    }
    setSavingChanges(true);

    try {
      const promises = [];

      // 1. Orders
      for (const [orderId, data] of Object.entries(pendingOrders)) {
        promises.push(
          fetch("/api/admin/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: Number(orderId), ...data }),
          })
        );
      }

      // 2. Services
      for (const [serviceId, data] of Object.entries(pendingServices)) {
        promises.push(
          fetch("/api/admin/services", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: Number(serviceId), ...data }),
          })
        );
      }

      // 3. Categories
      for (const [categoryId, data] of Object.entries(pendingCategories)) {
        promises.push(
          fetch("/api/admin/categories", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: Number(categoryId), ...data }),
          })
        );
      }

      const results = await Promise.all(promises);
      const allOk = results.every((r) => r.ok);

      if (allOk) {
        setPendingOrders({});
        setPendingServices({});
        setPendingCategories({});
        showNotification("success", `✓ All ${totalPendingCount} change(s) saved successfully to database!`);
        fetchAdminData();
      } else {
        showNotification("error", "Some changes could not be saved. Please review and try again.");
      }
    } catch (err) {
      console.error("Save changes error:", err);
      showNotification("error", "Failed to save changes to server.");
    } finally {
      setSavingChanges(false);
    }
  };

  const handleDiscardChanges = () => {
    if (confirm("Are you sure you want to discard all pending unsaved changes?")) {
      setPendingOrders({});
      setPendingServices({});
      setPendingCategories({});
      fetchAdminData();
      showNotification("success", "All unsaved changes discarded.");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`/api/admin/services?id=${serviceId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        showNotification("success", "Service deleted successfully.");
        fetchAdminData();
      } else {
        showNotification("error", data.error || "Cannot delete service with active orders.");
      }
    } catch {
      showNotification("error", "Failed to delete service.");
    }
  };

  // Filtered lists
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        orderStatusFilter === "all" ||
        (o.status || "").toLowerCase() === orderStatusFilter.toLowerCase();

      const search = orderSearch.toLowerCase().trim();
      const matchesSearch =
        !search ||
        String(o.order_id).includes(search) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(search)) ||
        (o.order_phone && o.order_phone.includes(search)) ||
        (o.address && o.address.toLowerCase().includes(search)) ||
        (o.service_name && o.service_name.toLowerCase().includes(search));

      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCat =
        serviceCatFilter === "all" ||
        String(s.category_id) === String(serviceCatFilter);

      const search = serviceSearch.toLowerCase().trim();
      const matchesSearch =
        !search ||
        (s.name && s.name.toLowerCase().includes(search)) ||
        (s.category_name && s.category_name.toLowerCase().includes(search));

      return matchesCat && matchesSearch;
    });
  }, [services, serviceCatFilter, serviceSearch]);

  // Loading state
  if (authChecking) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#090d16",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontFamily: "system-ui, sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "3px solid rgba(16, 185, 129, 0.2)",
            borderTopColor: "#10b981",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }} />
          <p style={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.85rem" }}>
            Verifying Security Credentials...
          </p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: SECURE AUTHENTICATION GATE (When not authenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #0f172a 0%, #020617 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
        color: "#f8fafc"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(51, 65, 85, 0.8)",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
        }}>
          {/* Top Shield Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              width: "56px",
              height: "56px",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.4))",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#34d399"
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0 0 6px", color: "#f8fafc" }}>
              GreenClean Admin Page
            </h1>
            <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, letterSpacing: "0.5px" }}>
              AUTHORIZED ADMINISTRATIVE ACCESS ONLY
            </p>
          </div>

          {/* Login Error Notification */}
          {loginError && (
            <div style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              padding: "12px 14px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>
                ADMIN USERNAME
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter admin username"
                required
                autoComplete="off"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "rgba(2, 6, 23, 0.7)",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>
                ADMIN PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    padding: "12px 42px 12px 14px",
                    background: "rgba(2, 6, 23, 0.7)",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "0.95rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    padding: "4px"
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                marginTop: "8px",
                padding: "14px",
                background: "linear-gradient(135deg, #059669, #10b981)",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: loginLoading ? "not-allowed" : "pointer",
                boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.4)",
                transition: "all 0.2s ease"
              }}
            >
              {loginLoading ? "Authenticating Session..." : "Sign In to Admin Page"}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid #1e293b", paddingTop: "18px" }}>
            <span style={{ fontSize: "0.75rem", color: "#475569" }}>
              Protected 256-bit encrypted administrative gateway
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b1120",
      color: "#f1f5f9",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <style>{`
        /* Remove up/down stepper arrows so users write manually */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          margin: 0 !important;
        }
        input[type=number] {
          -moz-appearance: textfield !important;
        }
      `}</style>
      {/* =====================================================================
          EXECUTIVE HEADER WITH DASHBOARD SELECTOR
          ===================================================================== */}
      <header style={{
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e293b",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px"
        }}>
          {/* Branding & Status */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #10b981, #047857)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1rem"
            }}>
              GC
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#f8fafc" }}>GreenClean Admin</span>

              </div>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Admin: {adminUsername}</span>
            </div>
          </div>

          {/* DASHBOARD SELECTOR TABS IN HEADER */}
          <nav style={{
            display: "flex",
            alignItems: "center",
            background: "#020617",
            padding: "4px",
            borderRadius: "10px",
            border: "1px solid #1e293b"
          }}>
            <button
              onClick={() => setActiveTab("orders")}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: activeTab === "orders" ? "linear-gradient(135deg, #059669, #10b981)" : "transparent",
                color: activeTab === "orders" ? "#ffffff" : "#94a3b8",
                transition: "all 0.15s ease"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: activeTab === "categories" ? "linear-gradient(135deg, #059669, #10b981)" : "transparent",
                color: activeTab === "categories" ? "#ffffff" : "#94a3b8",
                transition: "all 0.15s ease"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: activeTab === "services" ? "linear-gradient(135deg, #059669, #10b981)" : "transparent",
                color: activeTab === "services" ? "#ffffff" : "#94a3b8",
                transition: "all 0.15s ease"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Services & Products ({services.length})</span>
            </button>
          </nav>

          {/* Right: Save Changes, Discard, Refresh & Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            
            {/* MASTER SAVE CHANGES BUTTON IN HEADER */}
            <button
              onClick={handleSaveChanges}
              disabled={savingChanges || totalPendingCount === 0}
              title={totalPendingCount > 0 ? "Click to save all pending changes to database" : "No unsaved changes"}
              style={{
                background: totalPendingCount > 0
                  ? "linear-gradient(135deg, #059669, #10b981)"
                  : "rgba(30, 41, 59, 0.6)",
                border: totalPendingCount > 0
                  ? "1px solid #34d399"
                  : "1px solid #334155",
                color: totalPendingCount > 0 ? "#ffffff" : "#64748b",
                padding: "8px 18px",
                borderRadius: "8px",
                cursor: totalPendingCount > 0 && !savingChanges ? "pointer" : "default",
                fontSize: "0.85rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: totalPendingCount > 0 ? "0 0 16px rgba(16, 185, 129, 0.45)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>
                {savingChanges
                  ? "Saving Changes..."
                  : totalPendingCount > 0
                  ? `Save Changes (${totalPendingCount})`
                  : "Save Changes"}
              </span>
            </button>

            {/* Discard Button if changes are pending */}
            {totalPendingCount > 0 && (
              <button
                onClick={handleDiscardChanges}
                disabled={savingChanges}
                title="Discard all pending changes"
                style={{
                  background: "transparent",
                  border: "1px solid #475569",
                  color: "#cbd5e1",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  transition: "all 0.15s ease"
                }}
              >
                Discard
              </button>
            )}

            <button
              onClick={fetchAdminData}
              title="Refresh Data from Server"
              disabled={dataLoading}
              style={{
                background: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                color: "#94a3b8",
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>{dataLoading ? "Updating..." : "Refresh"}</span>
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Action Feedback Notification */}
      {feedback && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 100,
          background: feedback.type === "success" ? "#065f46" : "#7f1d1d",
          color: "#ffffff",
          border: `1px solid ${feedback.type === "success" ? "#34d399" : "#f87171"}`,
          borderRadius: "8px",
          padding: "12px 20px",
          fontSize: "0.88rem",
          fontWeight: 600,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          {feedback.type === "success" ? "✓" : "⚠️"} {feedback.text}
        </div>
      )}

      {/* Main Container */}
      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "28px 24px" }}>

        {/* ===================================================================
            KPI SUMMARY STATS BAR (Always visible above any selected dashboard)
            =================================================================== */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px"
        }}>
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "18px 20px"
          }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>
              Total Orders
            </span>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>
              {kpis.totalOrders}
            </div>
          </div>

          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "18px 20px"
          }}>
            <span style={{ fontSize: "0.75rem", color: "#34d399", textTransform: "uppercase", fontWeight: 600 }}>
              Total Order Revenue
            </span>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#10b981", marginTop: "4px" }}>
              £{kpis.totalRevenue.toLocaleString()}
            </div>
          </div>

          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "18px 20px"
          }}>
            <span style={{ fontSize: "0.75rem", color: "#fbbf24", textTransform: "uppercase", fontWeight: 600 }}>
              Pending Action
            </span>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fbbf24", marginTop: "4px" }}>
              {kpis.pendingCount}
            </div>
          </div>

          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "18px 20px"
          }}>
            <span style={{ fontSize: "0.75rem", color: "#60a5fa", textTransform: "uppercase", fontWeight: 600 }}>
              Confirmed Bookings
            </span>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#60a5fa", marginTop: "4px" }}>
              {kpis.confirmedCount}
            </div>
          </div>

          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "18px 20px"
          }}>
            <span style={{ fontSize: "0.75rem", color: "#a78bfa", textTransform: "uppercase", fontWeight: 600 }}>
              Completed Jobs
            </span>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#a78bfa", marginTop: "4px" }}>
              {kpis.completedCount}
            </div>
          </div>
        </div>

        {/* ===================================================================
            DASHBOARD 1: ORDERS DASHBOARD
            =================================================================== */}
        {activeTab === "orders" && (
          <section>
            {/* Header & Controls */}
            <div style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid #1e293b",
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "20px"
            }}>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                marginBottom: "16px"
              }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 4px" }}>Orders Dashboard</h2>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                    Manage customer service requests, schedules, and fulfillment statuses.
                  </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {/* Status filter */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    style={{
                      background: "#020617",
                      border: "1px solid #334155",
                      color: "#f8fafc",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      cursor: "pointer"
                    }}
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    <option value="pending">Pending ({kpis.pendingCount})</option>
                    <option value="confirmed">Confirmed ({kpis.confirmedCount})</option>
                    <option value="completed">Completed ({kpis.completedCount})</option>
                    <option value="cancelled">Cancelled ({kpis.cancelledCount})</option>
                  </select>

                  {/* Search box */}
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search order ID, email, phone..."
                    style={{
                      background: "#020617",
                      border: "1px solid #334155",
                      color: "#f8fafc",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      minWidth: "240px"
                    }}
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8" }}>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Order #</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Service</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Customer Contact</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Price</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Payment</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Scheduled Date</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Service Address</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Status</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600, textAlign: "right" }}>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ padding: "36px", textAlign: "center", color: "#64748b" }}>
                          No orders found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const statusColors = {
                          pending: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
                          confirmed: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" },
                          completed: { bg: "rgba(16, 185, 129, 0.15)", text: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
                          cancelled: { bg: "rgba(239, 68, 68, 0.15)", text: "#f87171", border: "rgba(239, 68, 68, 0.3)" }
                        };
                        const sc = statusColors[(order.status || "").toLowerCase()] || statusColors.pending;

                        const isOrderPending = Boolean(pendingOrders[order.order_id]);

                        return (
                          <tr key={order.order_id} style={{
                            borderBottom: "1px solid #1e293b",
                            background: isOrderPending ? "rgba(245, 158, 11, 0.05)" : "transparent",
                            borderLeft: isOrderPending ? "3px solid #f59e0b" : "3px solid transparent",
                            transition: "background 0.15s"
                          }}>
                            <td style={{ padding: "12px 10px", fontWeight: 700, color: "#e2e8f0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span>#{order.order_id}</span>
                                {isOrderPending && (
                                  <span style={{
                                    fontSize: "0.68rem",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    background: "rgba(245, 158, 11, 0.2)",
                                    border: "1px solid rgba(245, 158, 11, 0.5)",
                                    color: "#fbbf24",
                                    fontWeight: 700
                                  }}>
                                    Unsaved
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: "12px 10px" }}>
                              <div style={{ fontWeight: 600, color: "#f8fafc" }}>{order.service_name}</div>
                              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{order.category_name}</span>
                            </td>
                            <td style={{ padding: "12px 10px" }}>
                              <div style={{ color: "#f8fafc" }}>{order.customer_email}</div>
                              <div style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 600 }}>
                                📞 {order.order_phone}
                              </div>
                            </td>
                            <td style={{ padding: "12px 10px", fontWeight: 700, color: "#10b981" }}>
                              £{order.service_price}
                            </td>
                            <td style={{ padding: "12px 10px" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <span style={{
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  background: order.payment_method === "creditcard" ? "rgba(16, 185, 129, 0.15)" : "rgba(148, 163, 184, 0.15)",
                                  color: order.payment_method === "creditcard" ? "#34d399" : "#cbd5e1",
                                  border: `1px solid ${order.payment_method === "creditcard" ? "rgba(16, 185, 129, 0.3)" : "rgba(148, 163, 184, 0.3)"}`,
                                  width: "fit-content",
                                  whiteSpace: "nowrap"
                                }}>
                                  {order.payment_method === "creditcard" ? "💳 Stripe Card" : "💵 Pay Locally"}
                                </span>
                                <span style={{
                                  fontSize: "0.68rem",
                                  fontWeight: 600,
                                  color: order.payment_status === "paid" ? "#34d399" : "#fbbf24"
                                }}>
                                  {order.payment_status === "paid" ? "● Paid Online" : "○ Pending Collection"}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "12px 10px" }}>
                              {order.scheduled_date ? (
                                <span style={{
                                  display: "inline-block",
                                  padding: "5px 10px",
                                  background: "rgba(15, 23, 42, 0.8)",
                                  border: "1px solid #334155",
                                  borderRadius: "6px",
                                  fontSize: "0.8rem",
                                  color: "#e2e8f0",
                                  whiteSpace: "nowrap"
                                }}>
                                  {order.scheduled_date}
                                </span>
                              ) : (
                                <span style={{ color: "#64748b", fontSize: "0.8rem" }}>—</span>
                              )}
                            </td>
                            <td style={{ padding: "12px 10px", color: "#94a3b8", maxWidth: "220px", fontSize: "0.82rem" }}>
                              {order.address}
                            </td>
                            <td style={{ padding: "12px 10px" }}>
                              <span style={{
                                background: sc.bg,
                                color: sc.text,
                                border: `1px solid ${sc.border}`,
                                padding: "4px 10px",
                                borderRadius: "999px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                textTransform: "capitalize"
                              }}>
                                {order.status}
                              </span>
                            </td>
                            <td style={{ padding: "12px 10px", textAlign: "right" }}>
                              <select
                                value={order.status}
                                onChange={(e) => handleStageOrderStatus(order.order_id, e.target.value)}
                                style={{
                                  background: isOrderPending && pendingOrders[order.order_id]?.status ? "#1e1b4b" : "#020617",
                                  border: isOrderPending && pendingOrders[order.order_id]?.status ? "1px solid #818cf8" : "1px solid #334155",
                                  color: "#f8fafc",
                                  padding: "6px 8px",
                                  borderRadius: "6px",
                                  fontSize: "0.8rem",
                                  cursor: "pointer"
                                }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ===================================================================
            DASHBOARD 2: CATEGORIES DASHBOARD
            =================================================================== */}
        {activeTab === "categories" && (
          <section>
            <div style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid #1e293b",
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "20px"
            }}>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                marginBottom: "20px"
              }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 4px" }}>Categories Dashboard</h2>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                    Organize service classification hierarchy across the catalog.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  style={{
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    color: "#ffffff",
                    border: "none",
                    padding: "9px 16px",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Add New Category</span>
                </button>
              </div>

              {/* Categories Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8" }}>
                      <th style={{ padding: "12px 14px", fontWeight: 600 }}>Image</th>
                      <th style={{ padding: "12px 14px", fontWeight: 600 }}>Category ID</th>
                      <th style={{ padding: "12px 14px", fontWeight: 600 }}>Category Name</th>
                      <th style={{ padding: "12px 14px", fontWeight: 600 }}>Linked Services</th>
                      <th style={{ padding: "12px 14px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => {
                      const isCatPending = Boolean(pendingCategories[cat.id]);
                      return (
                        <tr key={cat.id} style={{
                          borderBottom: "1px solid #1e293b",
                          background: isCatPending ? "rgba(245, 158, 11, 0.05)" : "transparent",
                          borderLeft: isCatPending ? "3px solid #f59e0b" : "3px solid transparent",
                          transition: "background 0.15s"
                        }}>
                          <td style={{ padding: "12px 14px" }}>
                            <img
                              src={cat.image || "/services/oven.jpg"}
                              alt={cat.name}
                              style={{
                                width: "44px",
                                height: "44px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: isCatPending ? "2px solid #f59e0b" : "1px solid #334155",
                                display: "block"
                              }}
                            />
                          </td>
                          <td style={{ padding: "12px 14px", color: "#94a3b8" }}>#{cat.id}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 600, color: "#f8fafc" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span>{cat.name}</span>
                              {isCatPending && (
                                <span style={{
                                  fontSize: "0.68rem",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background: "rgba(245, 158, 11, 0.2)",
                                  border: "1px solid rgba(245, 158, 11, 0.5)",
                                  color: "#fbbf24",
                                  fontWeight: 700
                                }}>
                                  Unsaved
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{
                              background: "rgba(51, 65, 85, 0.5)",
                              color: "#cbd5e1",
                              padding: "3px 10px",
                              borderRadius: "999px",
                              fontSize: "0.78rem"
                            }}>
                              {cat.service_count || 0} services
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                              <button
                                onClick={() => setEditingCategory({ ...cat })}
                                style={{
                                  background: "rgba(59, 130, 246, 0.15)",
                                  border: "1px solid rgba(59, 130, 246, 0.3)",
                                  color: "#60a5fa",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  cursor: "pointer"
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id, cat.service_count)}
                                style={{
                                  background: "rgba(239, 68, 68, 0.15)",
                                  border: "1px solid rgba(239, 68, 68, 0.3)",
                                  color: "#f87171",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  cursor: "pointer"
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Category Modal */}
            {showAddCategoryModal && (
              <div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                padding: "16px"
              }}>
                <div style={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "24px",
                  width: "100%",
                  maxWidth: "420px"
                }}>
                  <h3 style={{ margin: "0 0 16px", color: "#f8fafc" }}>Create New Category</h3>
                  <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                        Category Name *
                      </label>
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. Steam Sanitization"
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          background: "#020617",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          color: "#fff",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    {/* Category Image Selector via File Upload */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px" }}>
                        Category Picture *
                      </label>

                      {/* Image Preview & Upload Button */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        background: "rgba(2, 6, 23, 0.6)",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px dashed #334155",
                        marginBottom: "10px"
                      }}>
                        <img
                          src={newCatImage || "/services/oven.jpg"}
                          alt="Preview"
                          style={{
                            width: "64px",
                            height: "64px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #10b981",
                            flexShrink: 0
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <label style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            background: uploadingImage ? "#334155" : "linear-gradient(135deg, #059669, #10b981)",
                            color: "#ffffff",
                            padding: "8px 14px",
                            borderRadius: "6px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: uploadingImage ? "not-allowed" : "pointer"
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>{uploadingImage ? "Uploading..." : "Upload Image File"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleCategoryFileUpload(e.target.files[0], false);
                                }
                              }}
                              style={{ display: "none" }}
                            />
                          </label>
                          <span style={{ display: "block", fontSize: "0.72rem", color: "#64748b", marginTop: "4px" }}>
                            PNG, JPG, WEBP from your device
                          </span>
                        </div>
                      </div>

                      {/* Presets Quick Pick (Optional) */}
                      <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block", marginBottom: "6px" }}>
                        Or choose from existing pictures:
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {CATEGORY_IMAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.path}
                            type="button"
                            onClick={() => setNewCatImage(preset.path)}
                            style={{
                              background: newCatImage === preset.path ? "rgba(16, 185, 129, 0.25)" : "#020617",
                              border: `1px solid ${newCatImage === preset.path ? "#10b981" : "#334155"}`,
                              color: newCatImage === preset.path ? "#34d399" : "#94a3b8",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              cursor: "pointer"
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                      <button
                        type="button"
                        onClick={() => setShowAddCategoryModal(false)}
                        style={{
                          background: "transparent",
                          border: "1px solid #475569",
                          color: "#cbd5e1",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={catActionLoading}
                        style={{
                          background: "#10b981",
                          border: "none",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        {catActionLoading ? "Saving..." : "Save Category"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Category Modal */}
            {editingCategory && (
              <div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                padding: "16px"
              }}>
                <div style={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "24px",
                  width: "100%",
                  maxWidth: "420px"
                }}>
                  <h3 style={{ margin: "0 0 16px", color: "#f8fafc" }}>Edit Category #{editingCategory.id}</h3>
                  <form onSubmit={handleStageCategoryEdit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                        Category Name
                      </label>
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          background: "#020617",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          color: "#fff",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    {/* Edit Category Image via File Upload */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px" }}>
                        Category Picture
                      </label>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        background: "rgba(2, 6, 23, 0.6)",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px dashed #334155",
                        marginBottom: "10px"
                      }}>
                        <img
                          src={editingCategory.image || "/services/oven.jpg"}
                          alt="Preview"
                          style={{
                            width: "64px",
                            height: "64px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #10b981",
                            flexShrink: 0
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <label style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            background: uploadingImage ? "#334155" : "linear-gradient(135deg, #059669, #10b981)",
                            color: "#ffffff",
                            padding: "8px 14px",
                            borderRadius: "6px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: uploadingImage ? "not-allowed" : "pointer"
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>{uploadingImage ? "Uploading..." : "Change Image File"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleCategoryFileUpload(e.target.files[0], true);
                                }
                              }}
                              style={{ display: "none" }}
                            />
                          </label>
                          <span style={{ display: "block", fontSize: "0.72rem", color: "#64748b", marginTop: "4px" }}>
                            Upload new photo from device
                          </span>
                        </div>
                      </div>

                      {/* Presets Quick Pick */}
                      <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block", marginBottom: "6px" }}>
                        Or choose from existing pictures:
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {CATEGORY_IMAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.path}
                            type="button"
                            onClick={() => setEditingCategory({ ...editingCategory, image: preset.path })}
                            style={{
                              background: editingCategory.image === preset.path ? "rgba(16, 185, 129, 0.25)" : "#020617",
                              border: `1px solid ${editingCategory.image === preset.path ? "#10b981" : "#334155"}`,
                              color: editingCategory.image === preset.path ? "#34d399" : "#94a3b8",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              cursor: "pointer"
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", marginTop: "14px" }}>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginRight: "auto" }}>
                        Staged changes must be saved in header.
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        style={{
                          background: "transparent",
                          border: "1px solid #475569",
                          color: "#cbd5e1",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          background: "linear-gradient(135deg, #059669, #10b981)",
                          border: "none",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Apply Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ===================================================================
            DASHBOARD 3: SERVICES & PRODUCTS DASHBOARD
            =================================================================== */}
        {activeTab === "services" && (
          <section>
            <div style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid #1e293b",
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "20px"
            }}>
              {/* Header & Controls */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                marginBottom: "16px"
              }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 4px" }}>Services & Products Dashboard</h2>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                    Configure service rates, durations, category mappings, and featured highlights.
                  </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {/* Category filter */}
                  <select
                    value={serviceCatFilter}
                    onChange={(e) => setServiceCatFilter(e.target.value)}
                    style={{
                      background: "#020617",
                      border: "1px solid #334155",
                      color: "#f8fafc",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      cursor: "pointer"
                    }}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  {/* Search box */}
                  <input
                    type="text"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    placeholder="Search services..."
                    style={{
                      background: "#020617",
                      border: "1px solid #334155",
                      color: "#f8fafc",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem"
                    }}
                  />

                  {/* Add button */}
                  <button
                    onClick={() => setShowAddServiceModal(true)}
                    style={{
                      background: "linear-gradient(135deg, #059669, #10b981)",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add Service</span>
                  </button>
                </div>
              </div>

              {/* Services Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8" }}>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>ID</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Service Name</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Category</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Price (£)</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Duration</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600 }}>Scope / Area</th>
                      <th style={{ padding: "12px 10px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "36px", textAlign: "center", color: "#64748b" }}>
                          No services found.
                        </td>
                      </tr>
                    ) : (
                      filteredServices.map((service) => {
                        const isServicePending = Boolean(pendingServices[service.id]);
                        return (
                          <tr key={service.id} style={{
                            borderBottom: "1px solid #1e293b",
                            background: isServicePending ? "rgba(245, 158, 11, 0.05)" : "transparent",
                            borderLeft: isServicePending ? "3px solid #f59e0b" : "3px solid transparent",
                            transition: "background 0.15s"
                          }}>
                            <td style={{ padding: "12px 10px", color: "#94a3b8" }}>#{service.id}</td>
                            <td style={{ padding: "12px 10px", fontWeight: 600, color: "#f8fafc" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span>{service.name}</span>
                                {isServicePending && (
                                  <span style={{
                                    fontSize: "0.68rem",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    background: "rgba(245, 158, 11, 0.2)",
                                    border: "1px solid rgba(245, 158, 11, 0.5)",
                                    color: "#fbbf24",
                                    fontWeight: 700
                                  }}>
                                    Unsaved
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: "12px 10px" }}>
                              <span style={{
                                background: "rgba(16, 185, 129, 0.12)",
                                color: "#34d399",
                                padding: "3px 8px",
                                borderRadius: "6px",
                                fontSize: "0.78rem"
                              }}>
                                {service.category_name}
                              </span>
                            </td>
                            <td style={{ padding: "12px 10px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ color: "#10b981", fontWeight: 700 }}>£</span>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={service.price ?? ""}
                                  onChange={(e) => handleStageServicePrice(service.id, e.target.value)}
                                  placeholder="0.00"
                                  style={{
                                    background: isServicePending && pendingServices[service.id]?.price !== undefined ? "#1e1b4b" : "#020617",
                                    border: isServicePending && pendingServices[service.id]?.price !== undefined ? "1px solid #818cf8" : "1px solid #334155",
                                    color: "#10b981",
                                    fontWeight: 700,
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    width: "80px",
                                    fontSize: "0.85rem",
                                    outline: "none"
                                  }}
                                />
                              </div>
                            </td>
                          <td style={{ padding: "12px 10px", color: "#cbd5e1" }}>
                            {service.time}
                          </td>
                          <td style={{ padding: "12px 10px", color: "#94a3b8", fontSize: "0.82rem" }}>
                            {service.width || "—"}
                          </td>
                          <td style={{ padding: "12px 10px", textAlign: "right" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                              <button
                                onClick={() => setEditingService({ ...service })}
                                style={{
                                  background: "rgba(59, 130, 246, 0.15)",
                                  border: "1px solid rgba(59, 130, 246, 0.3)",
                                  color: "#60a5fa",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  cursor: "pointer"
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteService(service.id)}
                                style={{
                                  background: "rgba(239, 68, 68, 0.15)",
                                  border: "1px solid rgba(239, 68, 68, 0.3)",
                                  color: "#f87171",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  cursor: "pointer"
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Service Modal */}
            {showAddServiceModal && (
              <div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                padding: "16px"
              }}>
                <div style={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "24px",
                  width: "100%",
                  maxWidth: "480px"
                }}>
                  <h3 style={{ margin: "0 0 16px", color: "#f8fafc" }}>Add New Service / Product</h3>
                  <form onSubmit={handleAddService} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                        Service Name *
                      </label>
                      <input
                        type="text"
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        placeholder="e.g. Deluxe Carpet Deep Wash"
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          background: "#020617",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          color: "#fff",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                          Category *
                        </label>
                        <select
                          value={serviceForm.category_id}
                          onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })}
                          required
                          style={{
                            width: "100%",
                            padding: "10px",
                            background: "#020617",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            color: "#fff",
                            boxSizing: "border-box"
                          }}
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                          Price (£) *
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                          placeholder="e.g. 120"
                          required
                          style={{
                            width: "100%",
                            padding: "10px",
                            background: "#020617",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            color: "#fff",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                          Estimated Time *
                        </label>
                        <input
                          type="text"
                          value={serviceForm.time}
                          onChange={(e) => setServiceForm({ ...serviceForm, time: e.target.value })}
                          placeholder="e.g. 1h 30m"
                          required
                          style={{
                            width: "100%",
                            padding: "10px",
                            background: "#020617",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            color: "#fff",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                          Scope / Dimensions
                        </label>
                        <input
                          type="text"
                          value={serviceForm.width}
                          onChange={(e) => setServiceForm({ ...serviceForm, width: e.target.value })}
                          placeholder="e.g. 15-25 sq.m"
                          style={{
                            width: "100%",
                            padding: "10px",
                            background: "#020617",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            color: "#fff",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                      <button
                        type="button"
                        onClick={() => setShowAddServiceModal(false)}
                        style={{
                          background: "transparent",
                          border: "1px solid #475569",
                          color: "#cbd5e1",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={serviceActionLoading}
                        style={{
                          background: "#10b981",
                          border: "none",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        {serviceActionLoading ? "Adding..." : "Add Service"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Service Modal */}
            {editingService && (
              <div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                padding: "16px"
              }}>
                <div style={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "24px",
                  width: "100%",
                  maxWidth: "480px"
                }}>
                  <h3 style={{ margin: "0 0 16px", color: "#f8fafc" }}>Edit Service #{editingService.id}</h3>
                  <form onSubmit={handleStageServiceEdit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                        Service Name
                      </label>
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          background: "#020617",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          color: "#fff",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                          Category
                        </label>
                        <select
                          value={editingService.category_id}
                          onChange={(e) => setEditingService({ ...editingService, category_id: e.target.value })}
                          required
                          style={{
                            width: "100%",
                            padding: "10px",
                            background: "#020617",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            color: "#fff",
                            boxSizing: "border-box"
                          }}
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                          Price (£)
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={editingService.price ?? ""}
                          onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                          required
                          style={{
                            width: "100%",
                            padding: "10px",
                            background: "#020617",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            color: "#fff",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                          Estimated Time
                        </label>
                        <input
                          type="text"
                          value={editingService.time}
                          onChange={(e) => setEditingService({ ...editingService, time: e.target.value })}
                          required
                          style={{
                            width: "100%",
                            padding: "10px",
                            background: "#020617",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            color: "#fff",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>
                          Scope / Dimensions
                        </label>
                        <input
                          type="text"
                          value={editingService.width || ""}
                          onChange={(e) => setEditingService({ ...editingService, width: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "10px",
                            background: "#020617",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            color: "#fff",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", marginTop: "16px" }}>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginRight: "auto" }}>
                        Staged changes must be saved in header.
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        style={{
                          background: "transparent",
                          border: "1px solid #475569",
                          color: "#cbd5e1",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          background: "linear-gradient(135deg, #059669, #10b981)",
                          border: "none",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Apply Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}
