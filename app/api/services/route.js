import { NextResponse } from "next/server";
import { getDbCategoriesWithServices, getAllDbServices } from "@/lib/servicesDb";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const flat = searchParams.get("flat");

    if (flat === "true") {
      const allServices = getAllDbServices();
      return NextResponse.json(allServices);
    }

    const categories = getDbCategoriesWithServices();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching services from DB:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
