import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { getCategoriesWithCount, insertCategory, updateCategory, deleteCategory } from "@/lib/db";

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

    const categories = await getCategoriesWithCount();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Admin categories GET error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, image } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }
    if (!image || !image.trim()) {
      return NextResponse.json({ error: "A category picture is required. Please select or provide an image." }, { status: 400 });
    }

    const finalSlug = slugify(name);
    const result = await insertCategory({
      name: name.trim(),
      slug: finalSlug,
      image: image.trim()
    });

    return NextResponse.json({
      success: true,
      categoryId: result.lastInsertRowid,
      message: "Category added successfully."
    });
  } catch (error) {
    console.error("Admin categories POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, slug, image } = await request.json();
    if (!id || !name) {
      return NextResponse.json({ error: "Category ID and name are required." }, { status: 400 });
    }

    const finalSlug = (slug && slug.trim()) ? slugify(slug) : slugify(name);
    await updateCategory(id, {
      name: name.trim(),
      slug: finalSlug,
      image: image !== undefined ? (image ? image.trim() : null) : undefined
    });

    return NextResponse.json({
      success: true,
      message: "Category updated successfully."
    });
  } catch (error) {
    console.error("Admin categories PATCH error:", error);
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
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
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await deleteCategory(parseInt(id, 10));

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully."
    });
  } catch (error) {
    console.error("Admin categories DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
  }
}
