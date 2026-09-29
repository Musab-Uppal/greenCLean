"use client";

import { useState, useEffect, useMemo } from "react";
import "./admin.css";

import {
  UK_TIME_SLOTS,
  normalizeTimeSlot,
  getUkDateString,
  getUkTomorrowDateString,
} from "@/lib/dateUtils";

import AdminLoginGate from "./components/AdminLoginGate";
import AdminHeader from "./components/AdminHeader";
import AdminKpiBar from "./components/AdminKpiBar";
import OrdersTab from "./components/OrdersTab";
import CategoriesTab from "./components/CategoriesTab";
import ServicesTab from "./components/ServicesTab";
import RescheduleOrderModal from "./components/RescheduleOrderModal";
import CategoryModals from "./components/CategoryModals";
import ServiceModals from "./components/ServiceModals";

export const CATEGORY_IMAGE_PRESETS = [
  { label: "Oven", path: "/services/oven.jpg" },
  { label: "Kitchen", path: "/services/kitchen.jpg" },
  { label: "Appliances", path: "/services/appliances.jpg" },
  { label: "BBQ", path: "/services/bbq.jpg" },
  { label: "Bathroom", path: "/services/bathroom.jpg" },
  { label: "House", path: "/services/house.jpg" },
  { label: "Tenancy", path: "/services/tenancy.jpg" },
];

function parseOrderDateTime(scheduledStr) {
  if (!scheduledStr) {
    return {
      date: getUkTomorrowDateString(),
      time: UK_TIME_SLOTS[0],
      raw: "",
    };
  }
  const str = String(scheduledStr).trim();
  const firstSpace = str.indexOf(" ");
  if (firstSpace === -1) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return { date: str, time: UK_TIME_SLOTS[0], raw: str };
    }
    return { date: getUkTomorrowDateString(), time: normalizeTimeSlot(str), raw: str };
  }
  const datePart = str.slice(0, firstSpace);
  const timePart = str.slice(firstSpace + 1).trim();
  return {
    date: datePart,
    time: normalizeTimeSlot(timePart),
    raw: str,
  };
}

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
    completedCount: 0,
  });

  // UI feedback alert
  const [feedback, setFeedback] = useState(null);

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");

  // Reschedule Order modal state (for pending orders)
  const [rescheduleOrder, setRescheduleOrder] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState(UK_TIME_SLOTS[0]);
  const [rescheduleCustomTime, setRescheduleCustomTime] = useState("");
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [rescheduleSaving, setRescheduleSaving] = useState(false);

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

  // Executive KPIs calculated dynamically from orders
  const computedKpis = useMemo(() => {
    let totalRevenue = 0;
    let pendingCount = 0;
    let completedCount = 0;

    orders.forEach((order) => {
      const amount = Number(order.total_amount) > 0 ? Number(order.total_amount) : Number(order.service_price) || 0;
      const paymentMethod = (order.payment_method || "local").toLowerCase().trim();
      const paymentStatus = (order.payment_status || "pending").toLowerCase().trim();
      const status = (order.status || "pending").toLowerCase().trim();

      const isCardPaymentReceived =
        (paymentMethod === "creditcard" || paymentMethod === "card" || paymentMethod === "stripe") &&
        paymentStatus === "paid";
      const isLocalPaymentCompleted =
        paymentMethod === "local" && status === "completed";

      if (isCardPaymentReceived || isLocalPaymentCompleted) {
        totalRevenue += amount;
      }

      if (status === "completed") {
        completedCount++;
      } else {
        pendingCount++;
      }
    });

    return {
      totalOrders: orders.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      pendingCount,
      completedCount,
    };
  }, [orders]);

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

  // 4. Order Management Actions
  const handleStageOrderStatus = (orderId, newStatus) => {
    const validStatus = (newStatus || "").toLowerCase() === "completed" ? "completed" : "pending";
    setOrders((prev) =>
      prev.map((o) => (o.order_id === orderId ? { ...o, status: validStatus } : o))
    );
    setPendingOrders((prev) => ({
      ...prev,
      [orderId]: { ...(prev[orderId] || {}), status: validStatus },
    }));
  };

  // Quick inline arrival time slot staging for pending orders
  const handleStageOrderScheduleTime = (orderId, newTimeSlot) => {
    const order = orders.find((o) => o.order_id === orderId);
    if (!order) return;

    const currentStatus = (pendingOrders[orderId]?.status || order.status || "pending").toLowerCase();
    if (currentStatus === "completed") {
      showNotification("error", "Cannot change time of a completed order. Set status to Pending first.");
      return;
    }

    const { date } = parseOrderDateTime(order.scheduled_date);
    const newScheduledDate = `${date} ${newTimeSlot}`;

    setOrders((prev) =>
      prev.map((o) =>
        o.order_id === orderId ? { ...o, scheduled_date: newScheduledDate } : o
      )
    );
    setPendingOrders((prev) => ({
      ...prev,
      [orderId]: { ...(prev[orderId] || {}), scheduled_date: newScheduledDate },
    }));
    showNotification(
      "success",
      `Order #${orderId} time changed to ${newTimeSlot}. Click "Save Changes" in the header to save.`
    );
  };

  // Open Reschedule Modal for detailed scheduling adjustments
  const handleOpenRescheduleModal = (order) => {
    const currentStatus = (pendingOrders[order.order_id]?.status || order.status || "pending").toLowerCase();
    if (currentStatus === "completed") {
      showNotification("error", "Cannot reschedule completed orders. Set status to Pending first.");
      return;
    }

    const parsed = parseOrderDateTime(order.scheduled_date);
    setRescheduleOrder(order);
    setRescheduleDate(parsed.date || getUkTomorrowDateString());

    if (UK_TIME_SLOTS.includes(parsed.time)) {
      setRescheduleTimeSlot(parsed.time);
      setIsCustomTime(false);
      setRescheduleCustomTime("");
    } else if (parsed.time) {
      setRescheduleTimeSlot("custom");
      setIsCustomTime(true);
      setRescheduleCustomTime(parsed.time);
    } else {
      setRescheduleTimeSlot(UK_TIME_SLOTS[0]);
      setIsCustomTime(false);
      setRescheduleCustomTime("");
    }
  };

  // Save reschedule directly to DB from the Reschedule Modal
  const handleSaveReschedule = async () => {
    if (!rescheduleOrder) return;

    const chosenTime = isCustomTime
      ? rescheduleCustomTime.trim()
      : rescheduleTimeSlot;

    if (!chosenTime) {
      showNotification("error", "Please select or enter an arrival time window.");
      return;
    }

    const chosenDate = (rescheduleDate || "").trim() || getUkTomorrowDateString();
    const newScheduledDate = `${chosenDate} ${chosenTime}`;

    setRescheduleSaving(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rescheduleOrder.order_id,
          scheduled_date: newScheduledDate,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === rescheduleOrder.order_id
              ? { ...o, scheduled_date: newScheduledDate }
              : o
          )
        );
        setPendingOrders((prev) => {
          const next = { ...prev };
          if (next[rescheduleOrder.order_id]) {
            const { scheduled_date, ...rest } = next[rescheduleOrder.order_id];
            if (Object.keys(rest).length === 0) {
              delete next[rescheduleOrder.order_id];
            } else {
              next[rescheduleOrder.order_id] = rest;
            }
          }
          return next;
        });
        showNotification(
          "success",
          `✓ Order #${rescheduleOrder.order_id} arrival time updated successfully in database!`
        );
        setRescheduleOrder(null);
      } else {
        showNotification("error", data.error || "Failed to update order time.");
      }
    } catch (err) {
      console.error("Direct reschedule error:", err);
      showNotification("error", "Failed to communicate with server.");
    } finally {
      setRescheduleSaving(false);
    }
  };

  // Category File Upload Handler
  const handleCategoryFileUpload = async (file, isEdit = false) => {
    if (!file) return;
    setUploadingImage(true);

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (isEdit) {
        setEditingCategory((prev) => (prev ? { ...prev, image: ev.target.result } : null));
      } else {
        setNewCatImage(ev.target.result);
      }
    };
    reader.readAsDataURL(file);

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

  // Category Management Actions
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

  // Service Management Actions
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

  // Master Save Changes Function
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
      <div className="admin-loading-screen">
        <div>
          <div className="admin-spinner" />
          <p style={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.85rem" }}>
            Verifying Security Credentials...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <AdminLoginGate
        usernameInput={usernameInput}
        setUsernameInput={setUsernameInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loginLoading={loginLoading}
        loginError={loginError}
        handleLogin={handleLogin}
      />
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="admin-root">
      {/* Executive Header */}
      <AdminHeader
        adminUsername={adminUsername}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={orders.length}
        categoriesCount={categories.length}
        servicesCount={services.length}
        handleSaveChanges={handleSaveChanges}
        savingChanges={savingChanges}
        totalPendingCount={totalPendingCount}
        fetchAdminData={fetchAdminData}
        dataLoading={dataLoading}
        handleLogout={handleLogout}
      />

      {/* Floating Action Feedback Notification */}
      {feedback && (
        <div className={`admin-feedback-toast ${feedback.type === "success" ? "success" : "error"}`}>
          {feedback.type === "success" ? "✓" : "⚠️"} {feedback.text}
        </div>
      )}

      {/* Main Container */}
      <main className="admin-main-container">
        {/* KPI Summary Stats Bar */}
        <AdminKpiBar computedKpis={computedKpis} />

        {/* Dashboard 1: Orders */}
        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            orderStatusFilter={orderStatusFilter}
            setOrderStatusFilter={setOrderStatusFilter}
            orderSearch={orderSearch}
            setOrderSearch={setOrderSearch}
            filteredOrders={filteredOrders}
            computedKpis={computedKpis}
            pendingOrders={pendingOrders}
            handleStageOrderStatus={handleStageOrderStatus}
            handleStageOrderScheduleTime={handleStageOrderScheduleTime}
            handleOpenRescheduleModal={handleOpenRescheduleModal}
            parseOrderDateTime={parseOrderDateTime}
          />
        )}

        {/* Dashboard 2: Categories */}
        {activeTab === "categories" && (
          <CategoriesTab
            categories={categories}
            pendingCategories={pendingCategories}
            setShowAddCategoryModal={setShowAddCategoryModal}
            setEditingCategory={setEditingCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        )}

        {/* Dashboard 3: Services */}
        {activeTab === "services" && (
          <ServicesTab
            categories={categories}
            serviceCatFilter={serviceCatFilter}
            setServiceCatFilter={setServiceCatFilter}
            serviceSearch={serviceSearch}
            setServiceSearch={setServiceSearch}
            setShowAddServiceModal={setShowAddServiceModal}
            filteredServices={filteredServices}
            pendingServices={pendingServices}
            handleStageServicePrice={handleStageServicePrice}
            setEditingService={setEditingService}
            handleDeleteService={handleDeleteService}
          />
        )}

        {/* Reschedule Order Modal */}
        <RescheduleOrderModal
          rescheduleOrder={rescheduleOrder}
          setRescheduleOrder={setRescheduleOrder}
          rescheduleDate={rescheduleDate}
          setRescheduleDate={setRescheduleDate}
          rescheduleTimeSlot={rescheduleTimeSlot}
          setRescheduleTimeSlot={setRescheduleTimeSlot}
          rescheduleCustomTime={rescheduleCustomTime}
          setRescheduleCustomTime={setRescheduleCustomTime}
          isCustomTime={isCustomTime}
          setIsCustomTime={setIsCustomTime}
          rescheduleSaving={rescheduleSaving}
          handleSaveReschedule={handleSaveReschedule}
        />

        {/* Category Add & Edit Modals */}
        <CategoryModals
          showAddCategoryModal={showAddCategoryModal}
          setShowAddCategoryModal={setShowAddCategoryModal}
          newCatName={newCatName}
          setNewCatName={setNewCatName}
          newCatImage={newCatImage}
          setNewCatImage={setNewCatImage}
          handleAddCategory={handleAddCategory}
          catActionLoading={catActionLoading}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          handleStageCategoryEdit={handleStageCategoryEdit}
          handleCategoryFileUpload={handleCategoryFileUpload}
          uploadingImage={uploadingImage}
          CATEGORY_IMAGE_PRESETS={CATEGORY_IMAGE_PRESETS}
        />

        {/* Service Add & Edit Modals */}
        <ServiceModals
          showAddServiceModal={showAddServiceModal}
          setShowAddServiceModal={setShowAddServiceModal}
          serviceForm={serviceForm}
          setServiceForm={setServiceForm}
          handleAddService={handleAddService}
          serviceActionLoading={serviceActionLoading}
          editingService={editingService}
          setEditingService={setEditingService}
          handleStageServiceEdit={handleStageServiceEdit}
          categories={categories}
        />
      </main>
    </div>
  );
}
