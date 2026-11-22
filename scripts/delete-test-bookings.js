import fs from "fs";
import { PrismaClient } from "@prisma/client";

// Read DATABASE_URL from .env if not in environment
if (!process.env.DATABASE_URL && fs.existsSync(".env")) {
  const content = fs.readFileSync(".env", "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("DATABASE_URL=")) {
      process.env.DATABASE_URL = trimmed.split("=")[1].trim().replace(/^["']|["']$/g, "");
      break;
    }
  }
}

const prisma = new PrismaClient();

async function deleteTestBookings() {
  console.log("=== Deleting Test Bookings (#1 and #2) ===");

  const targetIds = [1, 2];

  const existingOrders = await prisma.order.findMany({
    where: { id: { in: targetIds } },
    select: { id: true, customerEmail: true, totalAmount: true },
  });

  if (existingOrders.length === 0) {
    console.log("ℹ️ No test bookings (#1 or #2) found in the database. They may already be deleted.");
    return;
  }

  console.log(`Found ${existingOrders.length} test booking(s) to delete:`);
  existingOrders.forEach((o) => {
    console.log(`  - Order #${o.id} (${o.customerEmail}) - £${o.totalAmount}`);
  });

  const [deletedItems, deletedOrders] = await prisma.$transaction([
    prisma.orderItem.deleteMany({
      where: { orderId: { in: targetIds } },
    }),
    prisma.order.deleteMany({
      where: { id: { in: targetIds } },
    }),
  ]);

  console.log(`✅ Successfully deleted ${deletedOrders.count} order(s) and ${deletedItems.count} associated order item(s).`);
}

deleteTestBookings()
  .catch((err) => {
    console.error("❌ Failed to delete test bookings:", err.message);
  })
  .finally(() => prisma.$disconnect());
