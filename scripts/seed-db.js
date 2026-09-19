import { db, initSchema } from "../lib/db.js";
import { SERVICE_CATEGORIES } from "../data/servicesData.js";

console.log("🌱 Starting SQLite database initialization and seeding...");

// Ensure schema is created
initSchema();

// Begin transaction for fast and atomic seeding
const insertCategoryStmt = db.prepare(`
  INSERT INTO category (name, slug)
  VALUES (@name, @slug)
  ON CONFLICT(name) DO UPDATE SET slug = excluded.slug
`);

const getCategoryByNameStmt = db.prepare(`
  SELECT id FROM category WHERE name = ?
`);

const insertProductServiceStmt = db.prepare(`
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

const seedTransaction = db.transaction(() => {
  let categoryCount = 0;
  let serviceCount = 0;

  for (const cat of SERVICE_CATEGORIES) {
    insertCategoryStmt.run({
      name: cat.title,
      slug: cat.slug || cat.id
    });
    categoryCount++;

    const categoryRow = getCategoryByNameStmt.get(cat.title);
    const categoryId = categoryRow.id;

    for (const item of cat.items) {
      insertProductServiceStmt.run({
        name: item.name.trim(),
        category_id: categoryId,
        price: item.price,
        width: item.width || null,
        time: item.duration || "1 hr",
        slug: item.id,
        popular: item.popular ? 1 : 0
      });
      serviceCount++;
    }
  }

  return { categoryCount, serviceCount };
});

const result = seedTransaction();

console.log(`✅ Seeding complete!`);
console.log(`   - Categories inserted/updated: ${result.categoryCount}`);
console.log(`   - Products/Services inserted/updated: ${result.serviceCount}`);

// Verify and display database contents
const categories = db.prepare("SELECT * FROM category").all();
console.log("\n📂 Categories in DB:");
console.table(categories);

const servicesSample = db.prepare(`
  SELECT 
    ps.id,
    ps.name,
    c.name AS category,
    ps.price,
    ps.width,
    ps.time
  FROM product_service ps
  JOIN category c ON ps.category_id = c.id
  LIMIT 10
`).all();
console.log("\n🧹 Sample Products/Services in DB:");
console.table(servicesSample);
