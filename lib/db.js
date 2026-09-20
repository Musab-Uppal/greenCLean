import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "greenclean.db");

// Singleton instance across hot reloads in Next.js development
let dbInstance = globalThis._sqliteDb;

if (!dbInstance) {
  dbInstance = new Database(dbPath);
  dbInstance.pragma("journal_mode = WAL");
  dbInstance.pragma("foreign_keys = ON");
  globalThis._sqliteDb = dbInstance;
}

export const db = dbInstance;

/**
 * Initialize all database tables matching the required schema:
 * - category: name
 * - user: email, phone, password
 * - product/service: name, category(fk), price, width(nullable), time
 * - order: product/service, customer, address, phoneno
 */
export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT UNIQUE,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_service (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      price REAL NOT NULL,
      width TEXT,
      time TEXT NOT NULL,
      slug TEXT UNIQUE,
      FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_service_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      address TEXT NOT NULL,
      phoneno TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      scheduled_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_service_id) REFERENCES product_service(id) ON DELETE RESTRICT,
      FOREIGN KEY (customer_id) REFERENCES user(id) ON DELETE RESTRICT
    );

    CREATE VIEW IF NOT EXISTS "order" AS SELECT * FROM orders;
  `);

  // Migrate existing DBs — safe to run multiple times
  try { db.exec(`ALTER TABLE orders ADD COLUMN scheduled_date TEXT`); } catch (_) {}
  try { db.exec(`ALTER TABLE category ADD COLUMN image TEXT`); } catch (_) {}
  try {
    const tableInfo = db.prepare("PRAGMA table_info(product_service)").all();
    if (tableInfo.some((col) => col.name === "popular")) {
      db.exec("ALTER TABLE product_service DROP COLUMN popular");
    }
  } catch (_) {}
}

// Ensure schema is created on initial import
initSchema();

// ==========================================
// Category Queries
// ==========================================
export function getAllCategories() {
  return db.prepare("SELECT * FROM category ORDER BY id ASC").all();
}

export function getCategoryById(id) {
  return db.prepare("SELECT * FROM category WHERE id = ?").get(id);
}

export function getCategoryBySlug(slug) {
  return db.prepare("SELECT * FROM category WHERE slug = ?").get(slug);
}

export function insertCategory({ name, slug, image }) {
  const stmt = db.prepare(`
    INSERT INTO category (name, slug, image)
    VALUES (@name, @slug, @image)
    ON CONFLICT(name) DO UPDATE SET 
      slug = excluded.slug,
      image = COALESCE(excluded.image, category.image)
  `);
  return stmt.run({ name, slug: slug || null, image: image || null });
}

// ==========================================
// Product / Service Queries
// ==========================================
export function getAllServices() {
  return db.prepare(`
    SELECT 
      ps.*,
      c.name AS category_name,
      c.slug AS category_slug
    FROM product_service ps
    JOIN category c ON ps.category_id = c.id
    ORDER BY ps.category_id ASC, ps.id ASC
  `).all();
}

export function getServicesByCategory(categoryId) {
  return db.prepare(`
    SELECT 
      ps.*,
      c.name AS category_name,
      c.slug AS category_slug
    FROM product_service ps
    JOIN category c ON ps.category_id = c.id
    WHERE ps.category_id = ?
    ORDER BY ps.id ASC
  `).all(categoryId);
}

export function getServiceById(id) {
  return db.prepare(`
    SELECT 
      ps.*,
      c.name AS category_name,
      c.slug AS category_slug
    FROM product_service ps
    JOIN category c ON ps.category_id = c.id
    WHERE ps.id = ?
  `).get(id);
}

export function insertProductService({ name, category_id, price, width, time, slug }) {
  const stmt = db.prepare(`
    INSERT INTO product_service (name, category_id, price, width, time, slug)
    VALUES (@name, @category_id, @price, @width, @time, @slug)
    ON CONFLICT(slug) DO UPDATE SET 
      name = excluded.name,
      category_id = excluded.category_id,
      price = excluded.price,
      width = excluded.width,
      time = excluded.time
  `);
  return stmt.run({
    name,
    category_id,
    price,
    width: width || null,
    time,
    slug: slug || null
  });
}

// ==========================================
// User Queries
// ==========================================
export function createUser({ email, phone, password }) {
  const stmt = db.prepare(`
    INSERT INTO user (email, phone, password)
    VALUES (@email, @phone, @password)
  `);
  return stmt.run({ email, phone, password });
}

export function getUserByEmail(email) {
  return db.prepare("SELECT * FROM user WHERE email = ?").get(email);
}

export function getUserById(id) {
  return db.prepare("SELECT id, email, phone, created_at FROM user WHERE id = ?").get(id);
}

// ==========================================
// Order Queries
// ==========================================
export function createOrder({ product_service_id, customer_id, address, phoneno, status = "pending", scheduled_date = null }) {
  const stmt = db.prepare(`
    INSERT INTO orders (product_service_id, customer_id, address, phoneno, status, scheduled_date)
    VALUES (@product_service_id, @customer_id, @address, @phoneno, @status, @scheduled_date)
  `);
  return stmt.run({ product_service_id, customer_id, address, phoneno, status, scheduled_date });
}

export function updateOrder(id, { address, phoneno, scheduled_date }) {
  const updates = [];
  const params = { id };
  if (address !== undefined) {
    updates.push("address = @address");
    params.address = address;
  }
  if (phoneno !== undefined) {
    updates.push("phoneno = @phoneno");
    params.phoneno = phoneno;
  }
  if (scheduled_date !== undefined) {
    updates.push("scheduled_date = @scheduled_date");
    params.scheduled_date = scheduled_date;
  }
  if (updates.length === 0) return { changes: 0 };
  const stmt = db.prepare(`UPDATE orders SET ${updates.join(", ")} WHERE id = @id`);
  return stmt.run(params);
}

export function updateOrderScheduleTime(id, scheduled_date) {
  const stmt = db.prepare(`
    UPDATE orders SET scheduled_date = @scheduled_date WHERE id = @id
  `);
  return stmt.run({ id, scheduled_date });
}


export function getOrders(customerId = null) {
  if (customerId) {
    return db.prepare(`
      SELECT 
        o.id AS order_id,
        o.address,
        o.phoneno AS order_phone,
        o.status,
        o.scheduled_date,
        o.created_at,
        u.id AS customer_id,
        u.email AS customer_email,
        u.phone AS customer_default_phone,
        ps.id AS service_id,
        ps.name AS service_name,
        ps.price AS service_price,
        ps.width AS service_width,
        ps.time AS service_time,
        c.name AS category_name
      FROM orders o
      JOIN user u ON o.customer_id = u.id
      JOIN product_service ps ON o.product_service_id = ps.id
      JOIN category c ON ps.category_id = c.id
      WHERE o.customer_id = ?
      ORDER BY o.created_at DESC
    `).all(customerId);
  }

  return db.prepare(`
    SELECT 
      o.id AS order_id,
      o.address,
      o.phoneno AS order_phone,
      o.status,
      o.scheduled_date,
      o.created_at,
      u.id AS customer_id,
      u.email AS customer_email,
      u.phone AS customer_default_phone,
      ps.id AS service_id,
      ps.name AS service_name,
      ps.price AS service_price,
      ps.width AS service_width,
      ps.time AS service_time,
      c.name AS category_name
    FROM orders o
    JOIN user u ON o.customer_id = u.id
    JOIN product_service ps ON o.product_service_id = ps.id
    JOIN category c ON ps.category_id = c.id
    ORDER BY o.created_at DESC
  `).all();
}

export function getOrderById(id) {
  return db.prepare(`
    SELECT 
      o.id AS order_id,
      o.address,
      o.phoneno AS order_phone,
      o.status,
      o.scheduled_date,
      o.created_at,
      u.id AS customer_id,
      u.email AS customer_email,
      u.phone AS customer_default_phone,
      ps.id AS service_id,
      ps.name AS service_name,
      ps.price AS service_price,
      ps.width AS service_width,
      ps.time AS service_time,
      c.name AS category_name
    FROM orders o
    JOIN user u ON o.customer_id = u.id
    JOIN product_service ps ON o.product_service_id = ps.id
    JOIN category c ON ps.category_id = c.id
    WHERE o.id = ?
  `).get(id);
}

// ==========================================
// Admin Specific Database Functions
// ==========================================

export function updateOrderStatus(id, status) {
  const stmt = db.prepare(`
    UPDATE orders SET status = @status WHERE id = @id
  `);
  return stmt.run({ id, status });
}

export function getCategoriesWithCount() {
  return db.prepare(`
    SELECT 
      c.*,
      COUNT(ps.id) AS service_count
    FROM category c
    LEFT JOIN product_service ps ON ps.category_id = c.id
    GROUP BY c.id
    ORDER BY c.id ASC
  `).all();
}

export function updateCategory(id, { name, slug, image }) {
  const stmt = db.prepare(`
    UPDATE category 
    SET 
      name = @name, 
      slug = @slug,
      image = COALESCE(@image, image)
    WHERE id = @id
  `);
  return stmt.run({ id, name, slug: slug || null, image: image !== undefined ? image : null });
}

export function deleteCategory(id) {
  // Check if any product services exist for this category
  const count = db.prepare("SELECT COUNT(*) as count FROM product_service WHERE category_id = ?").get(id);
  if (count && count.count > 0) {
    throw new Error(`Cannot delete category: ${count.count} service(s) are still linked to it.`);
  }
  return db.prepare("DELETE FROM category WHERE id = ?").run(id);
}

export function updateProductService(id, { name, category_id, price, width, time }) {
  const stmt = db.prepare(`
    UPDATE product_service
    SET 
      name = COALESCE(@name, name),
      category_id = COALESCE(@category_id, category_id),
      price = COALESCE(@price, price),
      width = COALESCE(@width, width),
      time = COALESCE(@time, time)
    WHERE id = @id
  `);
  return stmt.run({
    id,
    name: name ?? null,
    category_id: category_id ?? null,
    price: price !== undefined ? Number(price) : null,
    width: width ?? null,
    time: time ?? null
  });
}

export function deleteProductService(id) {
  // Check if any orders reference this product
  const count = db.prepare("SELECT COUNT(*) as count FROM orders WHERE product_service_id = ?").get(id);
  if (count && count.count > 0) {
    throw new Error(`Cannot delete service: ${count.count} order(s) reference this service.`);
  }
  return db.prepare("DELETE FROM product_service WHERE id = ?").run(id);
}

