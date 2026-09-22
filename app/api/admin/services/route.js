import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { getAllServices, insertProductService, updateProductService, deleteProductService } from "@/lib/db";

export const dynamic = "force-dynamic";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await getAllServices();
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Admin services GET error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, category_id, price, width, time } = await request.json();

    if (!name || !category_id || price === undefined || !time) {
      return NextResponse.json(
        { error: "Name, category, price, and estimated duration time are required." },
        { status: 400 }
      );
    }

    const slug = slugify(name) + "-" + Math.floor(1000 + Math.random() * 9000);

    const result = await insertProductService({
      name: name.trim(),
      category_id: parseInt(category_id, 10),
      price: parseFloat(price),
      width: width ? width.trim() : null,
      time: time.trim(),
      slug
    });

    return NextResponse.json({
      success: true,
      serviceId: result.lastInsertRowid,
      message: "Service created successfully."
    });
  } catch (error) {
    console.error("Admin services POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create service" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, category_id, price, width, time } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    await updateProductService(id, {
      name,
      category_id: category_id !== undefined ? parseInt(category_id, 10) : undefined,
      price: price !== undefined ? parseFloat(price) : undefined,
      width,
      time
    });

    return NextResponse.json({
      success: true,
      message: "Service updated successfully."
    });
  } catch (error) {
    console.error("Admin services PATCH error:", error);
    return NextResponse.json({ error: error.message || "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    await deleteProductService(parseInt(id, 10));

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully."
    });
  } catch (error) {
    console.error("Admin services DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete service" }, { status: 500 });
  }
}
