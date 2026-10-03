import { PrismaClient } from "@prisma/client";
import { SERVICE_CATEGORIES } from "../data/servicesData.js";

const prisma = new PrismaClient();

// Map slug → hero image path from public/services/
const CATEGORY_IMAGES = {
  "oven-cleaning":          "/services/oven.jpg",
  "kitchen-cleaning":       "/services/kitchen.jpg",
  "appliances-cleaning":    "/services/appliances.jpg",
  "bbq-cleaning":           "/services/bbq.jpg",
  "bathroom-cleaning":      "/services/bathroom.jpg",
  "house-cleaning":         "/services/house.jpg",
  "end-of-tenancy-cleaning":"/services/tenancy.jpg",
};

async function main() {
  console.log("🌱 Starting PostgreSQL database seeding with Prisma...");

  let categoryCount = 0;
  let serviceCount = 0;

  for (const cat of SERVICE_CATEGORIES) {
    const slug = cat.slug || cat.id;
    const image = CATEGORY_IMAGES[slug] || cat.heroImage || null;

    // Upsert category (with image)
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name: cat.title, image },
      create: { name: cat.title, slug, image },
    });
    categoryCount++;
    console.log(`  📂 Category: ${category.name} (image: ${image})`);

    // Upsert each service in the category
    for (const item of cat.items) {
      await prisma.productService.upsert({
        where: { slug: item.id },
        update: {
          name: item.name.trim(),
          categoryId: category.id,
          price: item.price,
          width: item.width || null,
          time: item.duration || "1 hr",
        },
        create: {
          name: item.name.trim(),
          categoryId: category.id,
          price: item.price,
          width: item.width || null,
          time: item.duration || "1 hr",
          slug: item.id,
        },
      });
      serviceCount++;
      console.log(`    🧹 Service: ${item.name.trim()} — £${item.price}`);
    }
  }

  console.log(`\n✅ Seeding complete!`);
  console.log(`   - Categories inserted/updated: ${categoryCount}`);
  console.log(`   - Products/Services inserted/updated: ${serviceCount}`);

  // Verify DB contents
  const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });
  console.log("\n📂 Categories in DB:");
  console.table(categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, image: c.image })));

  const services = await prisma.productService.findMany({
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { id: "asc" }],
  });
  console.log(`\n🧹 All Services in DB (${services.length} total):`);
  console.table(
    services.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category.name,
      price: `£${s.price}`,
      width: s.width,
      time: s.time,
    }))
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
