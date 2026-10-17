import { PrismaClient } from "@prisma/client";

// Singleton — prevent multiple PrismaClient instances in Next.js hot-reload
const globalForPrisma = globalThis;
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ==========================================
// Category Queries
// ==========================================
export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { id: "asc" } });
}

export async function getCategoryById(id) {
  return prisma.category.findUnique({ where: { id: Number(id) } });
}

export async function getCategoryBySlug(slug) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function insertCategory({ name, slug, image }) {
  return prisma.category.upsert({
    where: { name },
    update: {
      slug: slug || null,
      image: image || undefined, // undefined = don't overwrite existing
    },
    create: {
      name,
      slug: slug || null,
      image: image || null,
    },
  });
}

// ==========================================
// Product / Service Queries
// ==========================================
export async function getAllServices() {
  const services = await prisma.productService.findMany({
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { id: "asc" }],
  });
  return services.map(_flattenService);
}

export async function getServicesByCategory(categoryId) {
  const services = await prisma.productService.findMany({
    where: { categoryId: Number(categoryId) },
    include: { category: true },
    orderBy: { id: "asc" },
  });
  return services.map(_flattenService);
}

export async function getServiceById(id) {
  const s = await prisma.productService.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
  return s ? _flattenService(s) : null;
}

export async function insertProductService({ name, category_id, price, width, time, slug }) {
  return prisma.productService.upsert({
    where: { slug: slug || `__no_slug_${Date.now()}` },
    update: { name, categoryId: Number(category_id), price: Number(price), width: width || null, time },
    create: { name, categoryId: Number(category_id), price: Number(price), width: width || null, time, slug: slug || null },
  });
}


// ==========================================
// Order Queries
// ==========================================
export async function createOrder({
  product_service_id = null,
  customer_email,
  address,
  phoneno,
  status = "pending",
  scheduled_date = null,
  payment_method = "local",
  payment_status = "pending",
  stripe_session_id = null,
  total_amount = null,
  items = [],
  marketing_consent = false,
  consent_date = null,
  consent_wording = null,
  consent_source = "booking-form",
  coupon_code = null,
  discount_amount = 0,
}) {
  const normalizedStatus =
    (status || "").toLowerCase().trim() === "completed" ? "completed" : "pending";

  // Build order items list
  const orderItems = [];
  if (Array.isArray(items) && items.length > 0) {
    items.forEach((it) => {
      const pid = it.product_service_id || it.db_id || it.id;
      if (pid) {
        orderItems.push({
          productServiceId: Number(pid),
          price: Number(it.price) || 0,
        });
      }
    });
  } else if (product_service_id) {
    orderItems.push({
      productServiceId: Number(product_service_id),
      price: Number(total_amount) || 0,
    });
  }

  const primaryServiceId = orderItems[0]?.productServiceId || null;
  const calculatedTotal =
    total_amount !== null && total_amount !== undefined
      ? Number(total_amount)
      : orderItems.reduce((acc, it) => acc + it.price, 0);

  const order = await prisma.order.create({
    data: {
      productServiceId: primaryServiceId ? Number(primaryServiceId) : null,
      customerEmail: customer_email || "",
      phoneno: phoneno || "",
      address,
      status: normalizedStatus,
      scheduledDate: scheduled_date,
      paymentMethod: payment_method,
      paymentStatus: payment_status,
      stripeSessionId: stripe_session_id,
      totalAmount: calculatedTotal,
      marketingConsent: !!marketing_consent,
      consentDate: marketing_consent && consent_date ? new Date(consent_date) : (marketing_consent ? new Date() : null),
      consentWording: marketing_consent ? (consent_wording || null) : null,
      consentSource: marketing_consent ? (consent_source || "booking-form") : null,
      couponCode: coupon_code ? String(coupon_code).trim().toUpperCase() : null,
      discountAmount: discount_amount ? Number(discount_amount) : 0,
      orderItems:
        orderItems.length > 0
          ? {
              create: orderItems.map((it) => ({
                productServiceId: it.productServiceId,
                price: it.price,
              })),
            }
          : undefined,
    },
  });

  if (coupon_code) {
    incrementCouponUsage(coupon_code).catch(() => {});
  }

  // Return shape compatible with old better-sqlite3 { lastInsertRowid }
  return { lastInsertRowid: order.id, ...order };
}

export async function updateOrder(
  id,
  { address, phoneno, status, scheduled_date, payment_method, payment_status, stripe_session_id, total_amount }
) {
  const data = {};
  if (address !== undefined) data.address = address;
  if (phoneno !== undefined) data.phoneno = phoneno;
  if (status !== undefined)
    data.status =
      (status || "").toLowerCase().trim() === "completed" ? "completed" : "pending";
  if (scheduled_date !== undefined) data.scheduledDate = scheduled_date;
  if (payment_method !== undefined) data.paymentMethod = payment_method;
  if (payment_status !== undefined) data.paymentStatus = payment_status;
  if (stripe_session_id !== undefined) data.stripeSessionId = stripe_session_id;
  if (total_amount !== undefined) data.totalAmount = total_amount;
  if (Object.keys(data).length === 0) return { changes: 0 };
  return prisma.order.update({ where: { id: Number(id) }, data });
}

export async function updateOrderPayment(id, { payment_status, stripe_session_id }) {
  return prisma.order.update({
    where: { id: Number(id) },
    data: {
      paymentStatus: payment_status,
      ...(stripe_session_id ? { stripeSessionId: stripe_session_id } : {}),
    },
  });
}

export async function updateOrderScheduleTime(id, scheduled_date) {
  return prisma.order.update({
    where: { id: Number(id) },
    data: { scheduledDate: scheduled_date },
  });
}

export async function getOrderItems(orderId) {
  const items = await prisma.orderItem.findMany({
    where: { orderId: Number(orderId) },
    include: {
      productService: { include: { category: true } },
    },
    orderBy: { id: "asc" },
  });
  return items.map(_flattenOrderItem);
}

export async function getOrders(customerEmail = null) {
  const where = customerEmail ? { customerEmail } : {};
  const rows = await prisma.order.findMany({
    where,
    include: {
      productService: { include: { category: true } },
      orderItems: {
        include: { productService: { include: { category: true } } },
        orderBy: { id: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(_flattenOrder);
}

export async function getOrderById(id) {
  const row = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      productService: { include: { category: true } },
      orderItems: {
        include: { productService: { include: { category: true } } },
        orderBy: { id: "asc" },
      },
    },
  });
  return row ? _flattenOrder(row) : null;
}

export async function getOrdersByStripeSessionId(sessionId) {
  if (!sessionId) return [];
  const rows = await prisma.order.findMany({
    where: { stripeSessionId: sessionId },
    include: {
      productService: { include: { category: true } },
      orderItems: {
        include: { productService: { include: { category: true } } },
        orderBy: { id: "asc" },
      },
    },
    orderBy: { id: "asc" },
  });
  return rows.map(_flattenOrder);
}

// ==========================================
// Admin Specific Database Functions
// ==========================================
export async function updateOrderStatus(id, status) {
  const normalizedStatus = (status || "").toLowerCase().trim();
  if (!["pending", "completed"].includes(normalizedStatus)) {
    throw new Error(
      `Invalid status "${status}". Allowed values are strictly: 'pending' or 'completed'.`
    );
  }
  return prisma.order.update({
    where: { id: Number(id) },
    data: { status: normalizedStatus },
  });
}

export async function getCategoriesWithCount() {
  const cats = await prisma.category.findMany({
    include: { _count: { select: { productServices: true } } },
    orderBy: { id: "asc" },
  });
  return cats.map((c) => ({
    ...c,
    service_count: c._count.productServices,
    _count: undefined,
  }));
}

export async function updateCategory(id, { name, slug, image }) {
  return prisma.category.update({
    where: { id: Number(id) },
    data: {
      name,
      slug: slug || null,
      ...(image !== undefined ? { image: image || null } : {}),
    },
  });
}

export async function deleteCategory(id) {
  const count = await prisma.productService.count({
    where: { categoryId: Number(id) },
  });
  if (count > 0) {
    throw new Error(
      `Cannot delete category: ${count} service(s) are still linked to it.`
    );
  }
  return prisma.category.delete({ where: { id: Number(id) } });
}

export async function updateProductService(id, { name, category_id, price, width, time }) {
  const data = {};
  if (name !== undefined) data.name = name;
  if (category_id !== undefined) data.categoryId = Number(category_id);
  if (price !== undefined) data.price = Number(price);
  if (width !== undefined) data.width = width;
  if (time !== undefined) data.time = time;
  return prisma.productService.update({ where: { id: Number(id) }, data });
}

export async function deleteProductService(id) {
  const countOrders = await prisma.order.count({
    where: { productServiceId: Number(id) },
  });
  const countItems = await prisma.orderItem.count({
    where: { productServiceId: Number(id) },
  });
  const totalCount = countOrders + countItems;
  if (totalCount > 0) {
    throw new Error(
      `Cannot delete service: ${totalCount} order item(s) reference this service.`
    );
  }
  return prisma.productService.delete({ where: { id: Number(id) } });
}

// ==========================================
// Internal shape helpers
// ==========================================

/** Map Prisma ProductService (with category included) → old flat row shape */
function _flattenService(s) {
  return {
    id: s.id,
    name: s.name,
    category_id: s.categoryId,
    price: s.price,
    width: s.width,
    time: s.time,
    slug: s.slug,
    category_name: s.category?.name ?? null,
    category_slug: s.category?.slug ?? null,
  };
}

/** Map Prisma Order (with all relations) → old flat row shape */
function _flattenOrder(o) {
  const items = (o.orderItems || []).map(_flattenOrderItem);
  const serviceNames =
    items.length > 0
      ? items.map((i) => i.service_name).join(", ")
      : o.productService?.name || "Eco Clean";
  const categoryNames =
    [...new Set(items.map((i) => i.category_name).filter(Boolean))].join(", ") ||
    o.productService?.category?.name ||
    "General";

  return {
    order_id: o.id,
    address: o.address,
    order_phone: o.phoneno,
    status: o.status,
    scheduled_date: o.scheduledDate,
    payment_method: o.paymentMethod,
    payment_status: o.paymentStatus,
    stripe_session_id: o.stripeSessionId,
    total_amount: o.totalAmount,
    coupon_code: o.couponCode ?? null,
    discount_amount: o.discountAmount ?? 0,
    created_at: o.createdAt,
    customer_email: o.customerEmail,
    customer_default_phone: o.phoneno,
    service_id: o.productService?.id ?? null,
    service_name: serviceNames,
    service_price: o.totalAmount ?? o.productService?.price ?? 0,
    service_width: o.productService?.width ?? null,
    service_time: o.productService?.time ?? null,
    category_name: categoryNames,
    items,
  };
}

/** Map Prisma OrderItem (with productService + category) → old flat shape */
function _flattenOrderItem(oi) {
  return {
    order_item_id: oi.id,
    product_service_id: oi.productServiceId,
    price: oi.price,
    service_name: oi.productService?.name ?? null,
    service_width: oi.productService?.width ?? null,
    service_time: oi.productService?.time ?? null,
    category_name: oi.productService?.category?.name ?? null,
    category_slug: oi.productService?.category?.slug ?? null,
    order_id: oi.orderId,
  };
}

// ==========================================
// Newsletter Subscriber Queries
// ==========================================
export async function saveSubscriber({
  email,
  firstName = "",
  lastName = "",
  phone = "",
  source = "website",
  marketing_consent = false,
  consent_date = null,
  consent_wording = null,
  consent_source = null,
}) {
  if (!email || !email.includes("@")) return null;
  const cleanEmail = email.trim().toLowerCase();

  const consentData = marketing_consent
    ? {
        marketingConsent: true,
        consentDate: consent_date ? new Date(consent_date) : new Date(),
        consentWording: consent_wording || null,
        consentSource: consent_source || source || "website",
      }
    : {};

  return prisma.newsletterSubscriber.upsert({
    where: { email: cleanEmail },
    update: {
      firstName: firstName ? firstName.trim() : undefined,
      lastName: lastName ? lastName.trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      source: source || undefined,
      ...consentData,
    },
    create: {
      email: cleanEmail,
      firstName: firstName ? firstName.trim() : null,
      lastName: lastName ? lastName.trim() : null,
      phone: phone ? phone.trim() : null,
      source: source || "website",
      marketingConsent: !!marketing_consent,
      consentDate: marketing_consent ? (consent_date ? new Date(consent_date) : new Date()) : null,
      consentWording: marketing_consent ? (consent_wording || null) : null,
      consentSource: marketing_consent ? (consent_source || source || "website") : null,
    },
  });
}

export async function getSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Returns all contacts who have explicitly given marketing consent,
 * combining order-form consents and newsletter-form consents.
 */
export async function getMarketingConsents() {
  // From booking orders
  const orderConsents = await prisma.order.findMany({
    where: { marketingConsent: true },
    select: {
      id: true,
      customerEmail: true,
      phoneno: true,
      marketingConsent: true,
      consentDate: true,
      consentWording: true,
      consentSource: true,
      createdAt: true,
    },
    orderBy: { consentDate: "desc" },
  });

  // From newsletter form
  const newsletterConsents = await prisma.newsletterSubscriber.findMany({
    where: { marketingConsent: true },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      marketingConsent: true,
      consentDate: true,
      consentWording: true,
      consentSource: true,
      createdAt: true,
    },
    orderBy: { consentDate: "desc" },
  });

  // Normalise both into a unified shape
  const fromOrders = orderConsents.map((o) => ({
    source_type: "booking",
    source_id: o.id,
    email: o.customerEmail,
    firstName: null,
    lastName: null,
    phone: o.phoneno,
    consentDate: o.consentDate,
    consentWording: o.consentWording,
    consentSource: o.consentSource,
    recordedAt: o.createdAt,
  }));

  const fromNewsletter = newsletterConsents.map((n) => ({
    source_type: "newsletter",
    source_id: n.id,
    email: n.email,
    firstName: n.firstName,
    lastName: n.lastName,
    phone: n.phone,
    consentDate: n.consentDate,
    consentWording: n.consentWording,
    consentSource: n.consentSource,
    recordedAt: n.createdAt,
  }));

  // Merge and deduplicate by email (prefer booking consent if both exist)
  const map = new Map();
  [...fromOrders, ...fromNewsletter].forEach((record) => {
    const key = (record.email || "").toLowerCase();
    if (!map.has(key)) {
      map.set(key, record);
    } else {
      // Keep the most recent consent
      const existing = map.get(key);
      if (record.consentDate > existing.consentDate) {
        map.set(key, record);
      }
    }
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.consentDate) - new Date(a.consentDate)
  );
}

/**
 * Returns all consents as a CSV-ready array of objects (for export).
 */
export async function getConsentExportData() {
  const consents = await getMarketingConsents();
  return consents.map((c) => ({
    Email: c.email,
    "First Name": c.firstName || "",
    "Last Name": c.lastName || "",
    Phone: c.phone || "",
    "Consent Date": c.consentDate ? new Date(c.consentDate).toISOString() : "",
    "Consent Source": c.consentSource || "",
    "Consent Wording": c.consentWording || "",
    "Source Type": c.source_type,
    "Record ID": c.source_id,
  }));
}

// ==========================================
// Coupon Queries & Validation
// ==========================================

export async function getAllCoupons() {
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getCouponByCode(code) {
  if (!code) return null;
  const normalized = String(code).trim().toUpperCase();
  return prisma.coupon.findUnique({
    where: { code: normalized },
  });
}

export async function createCoupon({
  code,
  discountType = "percentage",
  discountValue,
  minOrderAmount = 0,
  maxUses = null,
  expiresAt = null,
  isActive = true,
}) {
  const normalizedCode = (code || "").trim().toUpperCase();
  if (!normalizedCode) throw new Error("Coupon code is required");
  const parsedValue = parseFloat(discountValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw new Error("Discount value must be greater than 0");
  }
  const type = discountType === "fixed" ? "fixed" : "percentage";
  if (type === "percentage" && parsedValue > 100) {
    throw new Error("Percentage discount cannot exceed 100%");
  }

  return prisma.coupon.create({
    data: {
      code: normalizedCode,
      discountType: type,
      discountValue: parsedValue,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
      maxUses: maxUses ? parseInt(maxUses, 10) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: isActive !== false,
    },
  });
}

export async function updateCoupon(id, data) {
  const updateData = {};
  if (data.code !== undefined) updateData.code = String(data.code).trim().toUpperCase();
  if (data.discountType !== undefined) {
    updateData.discountType = data.discountType === "fixed" ? "fixed" : "percentage";
  }
  if (data.discountValue !== undefined) {
    const val = parseFloat(data.discountValue);
    if (isNaN(val) || val <= 0) throw new Error("Discount value must be greater than 0");
    if (updateData.discountType === "percentage" && val > 100) {
      throw new Error("Percentage discount cannot exceed 100%");
    }
    updateData.discountValue = val;
  }
  if (data.minOrderAmount !== undefined) {
    updateData.minOrderAmount = data.minOrderAmount ? parseFloat(data.minOrderAmount) : 0;
  }
  if (data.maxUses !== undefined) {
    updateData.maxUses = data.maxUses ? parseInt(data.maxUses, 10) : null;
  }
  if (data.expiresAt !== undefined) {
    updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
  }
  if (data.isActive !== undefined) {
    updateData.isActive = Boolean(data.isActive);
  }

  return prisma.coupon.update({
    where: { id: Number(id) },
    data: updateData,
  });
}

export async function deleteCoupon(id) {
  return prisma.coupon.delete({
    where: { id: Number(id) },
  });
}

export async function validateCoupon(code, subtotal = 0) {
  if (!code || typeof code !== "string") {
    return { valid: false, error: "Please enter a coupon code." };
  }
  const normalized = code.trim().toUpperCase();
  const coupon = await prisma.coupon.findUnique({
    where: { code: normalized },
  });

  if (!coupon) {
    return { valid: false, error: `Coupon "${normalized}" does not exist.` };
  }

  if (!coupon.isActive) {
    return { valid: false, error: `Coupon "${coupon.code}" is currently inactive.` };
  }

  if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
    return {
      valid: false,
      error: `Coupon "${coupon.code}" expired on ${new Date(coupon.expiresAt).toLocaleDateString("en-GB")}.`,
    };
  }

  if (coupon.maxUses !== null && coupon.maxUses !== undefined && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: `Coupon "${coupon.code}" has reached its maximum usage limit.` };
  }

  const numSubtotal = Number(subtotal) || 0;
  const minRequired = coupon.minOrderAmount || 0;
  if (minRequired > 0 && numSubtotal < minRequired) {
    return {
      valid: false,
      error: `Coupon "${coupon.code}" requires a minimum booking spend of £${minRequired.toFixed(2)}. Current subtotal is £${numSubtotal.toFixed(2)}.`,
    };
  }

  let discountAmount = 0;
  let discountPercent = 0;

  if (coupon.discountType === "fixed") {
    discountAmount = Math.min(coupon.discountValue, numSubtotal);
    discountPercent = numSubtotal > 0 ? Math.round((discountAmount / numSubtotal) * 100) : 0;
  } else {
    discountPercent = coupon.discountValue;
    discountAmount = Math.round(((numSubtotal * coupon.discountValue) / 100) * 100) / 100;
  }

  const newTotal = Math.max(0, Math.round((numSubtotal - discountAmount) * 100) / 100);

  return {
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    discountPercent,
    newTotal,
    message: coupon.discountType === "fixed"
      ? `Success! £${coupon.discountValue.toFixed(2)} discount applied.`
      : `Success! ${coupon.discountValue}% discount applied.`,
  };
}

export async function incrementCouponUsage(code) {
  if (!code) return null;
  const normalized = String(code).trim().toUpperCase();
  try {
    return await prisma.coupon.update({
      where: { code: normalized },
      data: { usedCount: { increment: 1 } },
    });
  } catch (err) {
    console.warn(`[incrementCouponUsage] Could not increment for code "${normalized}":`, err?.message);
    return null;
  }
}

// ==========================================
// Admin Leave / Blocked Dates Management
// ==========================================

export async function getAllBlockedDates() {
  return prisma.blockedDate.findMany({
    orderBy: { date: "asc" },
  });
}

export async function getBlockedDateStrings() {
  const records = await prisma.blockedDate.findMany({
    select: { date: true },
    orderBy: { date: "asc" },
  });
  return records.map((r) => r.date);
}

export async function addBlockedDate({ date, reason = "Leave / Unavailable" }) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  return prisma.blockedDate.upsert({
    where: { date },
    update: { reason: reason?.trim() || "Leave / Unavailable" },
    create: {
      date,
      reason: reason?.trim() || "Leave / Unavailable",
    },
  });
}

export async function addBlockedDateRange({ startDate, endDate, reason = "Annual Leave" }) {
  if (!startDate || !endDate) {
    throw new Error("Both start date and end date are required.");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    throw new Error("Invalid date range specified.");
  }

  const created = [];
  const current = new Date(start);

  while (current <= end) {
    const isoDate = current.toISOString().split("T")[0];
    const rec = await prisma.blockedDate.upsert({
      where: { date: isoDate },
      update: { reason: reason?.trim() || "Annual Leave" },
      create: {
        date: isoDate,
        reason: reason?.trim() || "Annual Leave",
      },
    });
    created.push(rec);
    current.setDate(current.getDate() + 1);
  }

  return created;
}

export async function deleteBlockedDate(id) {
  return prisma.blockedDate.delete({
    where: { id: Number(id) },
  });
}

export async function deleteBlockedDateByDate(date) {
  return prisma.blockedDate.delete({
    where: { date },
  });
}

export async function isDateBlocked(dateOrScheduledStr) {
  if (!dateOrScheduledStr) return false;
  const datePart = String(dateOrScheduledStr).trim().split(" ")[0];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return false;

  const found = await prisma.blockedDate.findUnique({
    where: { date: datePart },
  });
  return !!found;
}


