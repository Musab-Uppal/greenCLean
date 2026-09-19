import { db } from "../lib/db.js";
import { 
  createUser, 
  getUserByEmail, 
  createOrder, 
  getOrders, 
  getAllCategories, 
  getAllServices 
} from "../lib/db.js";

console.log("🔍 Running comprehensive SQLite database tests...\n");

// 1. Verify Tables
const tables = db.prepare("SELECT name, type FROM sqlite_master WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%'").all();
console.log("1. Tables & Views in Database:");
console.table(tables);

const expectedTables = ["category", "user", "product_service", "orders", "order"];
for (const t of expectedTables) {
  const found = tables.some(row => row.name === t);
  if (!found) throw new Error(`Missing expected table/view: ${t}`);
}
console.log("✅ All required tables and views exist.\n");

// 2. Verify Columns
console.log("2. Verifying column schemas:");
const pragmaCols = (tableName) => db.prepare(`PRAGMA table_info(${tableName})`).all();

const userCols = pragmaCols("user").map(c => c.name);
console.log("User table columns:", userCols);
if (!["id", "email", "phone", "password"].every(c => userCols.includes(c))) {
  throw new Error("User table missing required columns!");
}

const serviceCols = pragmaCols("product_service").map(c => c.name);
console.log("Product_service columns:", serviceCols);
if (!["id", "name", "category_id", "price", "width", "time"].every(c => serviceCols.includes(c))) {
  throw new Error("product_service table missing required columns!");
}

const orderCols = pragmaCols("orders").map(c => c.name);
console.log("Orders columns:", orderCols);
if (!["id", "product_service_id", "customer_id", "address", "phoneno"].every(c => orderCols.includes(c))) {
  throw new Error("orders table missing required columns!");
}
console.log("✅ Column schemas strictly match requirements.\n");

// 3. Verify Seeding Counts & Data
console.log("3. Verifying Seeded Data:");
const categories = getAllCategories();
console.log(`- Categories count: ${categories.length} (Expected: 7)`);
if (categories.length !== 7) throw new Error(`Expected 7 categories, got ${categories.length}`);

const services = getAllServices();
console.log(`- Services count: ${services.length} (Expected: 31)`);
if (services.length !== 31) throw new Error(`Expected 31 services, got ${services.length}`);

// Check nullable width
const houseServices = services.filter(s => s.category_name === "House Cleaning");
const nullWidths = houseServices.filter(s => s.width === null);
console.log(`- House Cleaning items with NULL width: ${nullWidths.length}/${houseServices.length}`);
if (nullWidths.length === 0) throw new Error("Expected nullable width for house cleaning services");

const singleOven = services.find(s => s.name === "Single Oven");
console.log(`- Single Oven: Price £${singleOven.price}, Width: "${singleOven.width}", Time: "${singleOven.time}"`);
if (singleOven.price !== 60 || singleOven.width !== "60cm" || singleOven.time !== "40 min – 1 hr") {
  throw new Error("Single oven details do not match exact specifications!");
}
console.log("✅ Seeded services match exact details.\n");

// 4. Test User Creation & Fetching
console.log("4. Testing User Creation & Retrieval:");
const testEmail = `test_${Date.now()}@example.co.uk`;
const testPhone = "07123456789";
const userResult = createUser({
  email: testEmail,
  phone: testPhone,
  password: "hashed_password_123"
});
console.log(`- Created user ID: ${userResult.lastInsertRowid}`);

const user = getUserByEmail(testEmail);
if (!user || user.email !== testEmail || user.phone !== testPhone) {
  throw new Error("Failed to retrieve created user accurately");
}
console.log(`✅ User created and retrieved successfully: ${user.email} (Phone: ${user.phone})\n`);

// 5. Test Order Creation with Specific Location & Phone
console.log("5. Testing Order Creation (with location-specific phone):");
const altPhoneForOrder = "07999888777";
const orderAddress = "Flat 4B, 12 Matthew Street, Liverpool, L2 6RE";
const serviceToBook = singleOven.id;

const orderResult = createOrder({
  product_service_id: serviceToBook,
  customer_id: user.id,
  address: orderAddress,
  phoneno: altPhoneForOrder,
  status: "confirmed"
});
console.log(`- Created order ID: ${orderResult.lastInsertRowid}`);

const customerOrders = getOrders(user.id);
if (customerOrders.length !== 1) {
  throw new Error(`Expected 1 order for customer, got ${customerOrders.length}`);
}

const savedOrder = customerOrders[0];
console.log("- Saved Order Details:");
console.log(`  Order ID: ${savedOrder.order_id}`);
console.log(`  Customer: ${savedOrder.customer_email} (Default Phone: ${savedOrder.customer_default_phone})`);
console.log(`  Location Delivery Phone: ${savedOrder.order_phone}`);
console.log(`  Address: ${savedOrder.address}`);
console.log(`  Service: ${savedOrder.service_name} (£${savedOrder.service_price})`);
console.log(`  Category: ${savedOrder.category_name}`);
console.log(`  Duration/Time: ${savedOrder.service_time}`);

if (savedOrder.order_phone !== altPhoneForOrder || savedOrder.address !== orderAddress) {
  throw new Error("Order specific phone number or address mismatch!");
}
console.log("✅ Order relation and location phone verified.\n");

// 6. Test Foreign Key Constraint Enforcement
console.log("6. Testing Foreign Key Constraints:");
try {
  createOrder({
    product_service_id: 99999, // non-existent service
    customer_id: user.id,
    address: "Nowhere",
    phoneno: "0000000000"
  });
  throw new Error("FK constraint failed to block invalid service ID!");
} catch (err) {
  if (err.message.includes("FOREIGN KEY constraint failed")) {
    console.log("✅ Foreign key enforcement blocked invalid product_service_id as expected.");
  } else {
    throw err;
  }
}

try {
  createOrder({
    product_service_id: serviceToBook,
    customer_id: 99999, // non-existent customer
    address: "Nowhere",
    phoneno: "0000000000"
  });
  throw new Error("FK constraint failed to block invalid customer ID!");
} catch (err) {
  if (err.message.includes("FOREIGN KEY constraint failed")) {
    console.log("✅ Foreign key enforcement blocked invalid customer_id as expected.");
  } else {
    throw err;
  }
}

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! Database is fully operational.");
