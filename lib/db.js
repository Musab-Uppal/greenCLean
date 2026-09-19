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
      slug TEXT UNIQUE
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
      popular INTEGER DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_service_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      address TEXT NOT NULL,
      phoneno TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_service_id) REFERENCES product_service(id) ON DELETE RESTRICT,
      FOREIGN KEY (customer_id) REFERENCES user(id) ON DELETE RESTRICT
    );

    CREATE VIEW IF NOT EXISTS "order" AS SELECT * FROM orders;
  `);
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

export function insertCategory({ name, slug }) {
  const stmt = db.prepare(`
    INSERT INTO category (name, slug)
    VALUES (@name, @slug)
    ON CONFLICT(name) DO UPDATE SET slug = excluded.slug
  `);
  return stmt.run({ name, slug: slug || null });
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

export function insertProductService({ name, category_id, price, width, time, slug, popular }) {
  const stmt = db.prepare(`
    INSERT INTO product_service (name, category_id, price, width, time, slug, popular)
    VALUES (@name, @category_id, @price, @width, @time, @slug, @popular)
    ON CONFLICT(slug) DO UPDATE SET 
      name = excluded.name,
      category_id = excluded.category_id,
      price = excluded.price,
      width = excluded.width,
      time = excluded.time,
      popular = excluded.popular
  `);
  return stmt.run({
    name,
    category_id,
    price,
    width: width || null,
    time,
    slug: slug || null,
    popular: popular ? 1 : 0
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
export function createOrder({ product_service_id, customer_id, address, phoneno, status = "pending" }) {
  const stmt = db.prepare(`
    INSERT INTO orders (product_service_id, customer_id, address, phoneno, status)
    VALUES (@product_service_id, @customer_id, @address, @phoneno, @status)
  `);
  return stmt.run({ product_service_id, customer_id, address, phoneno, status });
}

export function getOrders(customerId = null) {
  if (customerId) {
    return db.prepare(`
      SELECT 
        o.id AS order_id,
        o.address,
        o.phoneno AS order_phone,
        o.status,
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
