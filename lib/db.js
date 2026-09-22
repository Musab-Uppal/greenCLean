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
// User Queries
// ==========================================
export async function createUser({ email, phone, password }) {
  return prisma.user.create({ data: { email, phone, password } });
}

export async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true, email: true, phone: true, createdAt: true },
  });
}

// ==========================================
// Order Queries
// ==========================================
export async function createOrder({
  product_service_id = null,
  customer_id,
  address,
  phoneno,
  status = "pending",
  scheduled_date = null,
  payment_method = "local",
  payment_status = "pending",
  stripe_session_id = null,
  total_amount = null,
  items = [],
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
      customerId: Number(customer_id),
      address,
      phoneno,
      status: normalizedStatus,
      scheduledDate: scheduled_date,
      paymentMethod: payment_method,
      paymentStatus: payment_status,
      stripeSessionId: stripe_session_id,
      totalAmount: calculatedTotal,
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

export async function getOrders(customerId = null) {
  const where = customerId ? { customerId: Number(customerId) } : {};
  const rows = await prisma.order.findMany({
    where,
    include: {
      customer: true,
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
      customer: true,
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
      customer: true,
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
    created_at: o.createdAt,
    customer_id: o.customer?.id,
    customer_email: o.customer?.email,
    customer_default_phone: o.customer?.phone,
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
