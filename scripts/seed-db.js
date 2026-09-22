import { PrismaClient } from "@prisma/client";
import { SERVICE_CATEGORIES } from "../data/servicesData.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting PostgreSQL database seeding with Prisma...");

  let categoryCount = 0;
  let serviceCount = 0;

  for (const cat of SERVICE_CATEGORIES) {
    const slug = cat.slug || cat.id;

    // Upsert category
    const category = await prisma.category.upsert({
      where: { name: cat.title },
      update: { slug },
      create: { name: cat.title, slug },
    });
    categoryCount++;

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
    }
  }

  console.log(`✅ Seeding complete!`);
  console.log(`   - Categories inserted/updated: ${categoryCount}`);
  console.log(`   - Products/Services inserted/updated: ${serviceCount}`);

  // Verify DB contents
  const categories = await prisma.category.findMany();
  console.log("\n📂 Categories in DB:");
  console.table(categories);

  const servicesSample = await prisma.productService.findMany({
    take: 10,
    include: { category: true },
  });
  console.log("\n🧹 Sample Products/Services in DB:");
  console.table(
    servicesSample.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category.name,
      price: s.price,
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
