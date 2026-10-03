import { getAllCategories, getAllServices } from "./db.js";
import { SERVICE_CATEGORIES } from "../data/servicesData.js";

// Visual / Presentation metadata mapped by category slug
const CATEGORY_META = {
  "oven-cleaning": {
    shortDesc: "Oven cleaning in Liverpool and surrounding areas including Wirral, Warrington, St Helens, Southport and Chester. We use a van-mounted heated dip tank with non-caustic, fume-free solution — no harsh smells, safe to cook in straight after.",
    icon: "Flame",
    badge: "Most Popular",
    heroImage: "/services/oven.jpg"
  },
  "kitchen-cleaning": {
    shortDesc: "Kitchen cleaning across Liverpool, Merseyside, Wirral and Warrington. We clean cupboard fronts, worktops, tiles, splashbacks, sinks and appliance exteriors using eco-friendly products. Oven, hob and extractor cleaning are available at an additional cost.",
    icon: "UtensilsCrossed",
    badge: "Essential",
    heroImage: "/services/kitchen.jpg"
  },
  "appliances-cleaning": {
    shortDesc: "Fridge, freezer, dishwasher and washing machine cleaning in Liverpool, Knowsley, St Helens and the Wirral. We use non-caustic products to clean appliance interiors, with descaling where needed.",
    icon: "Refrigerator",
    badge: "Eco-Fresh",
    heroImage: "/services/appliances.jpg"
  },
  "bbq-cleaning": {
    shortDesc: "BBQ cleaning in Liverpool, Southport, Formby and across Merseyside. We remove baked-on carbon and grease from grates, burners and the firebox using food-safe, non-caustic products — ready to grill on the same day.",
    icon: "Beef",
    badge: "Summer Favourite",
    heroImage: "/services/bbq.jpg"
  },
  "bathroom-cleaning": {
    shortDesc: "Bathroom cleaning across Liverpool, Sefton, Halton and the wider Merseyside area. We clean baths, showers, toilets, sinks and tiles, tackling limescale and soap residue with eco-friendly cleaning products.",
    icon: "Bath",
    badge: "Hygienic",
    heroImage: "/services/bathroom.jpg"
  },
  "house-cleaning": {
    shortDesc: "Professional house cleaning in Liverpool, Bootle, Crosby, Ormskirk and surrounding areas. Regular cleaning is £22 per hour, with a minimum booking of 2 hours. Deep cleaning is available at fixed prices based on property size. We bring our own equipment and eco-friendly cleaning products.",
    icon: "Home",
    badge: "Full Care",
    heroImage: "/services/house.jpg"
  },
  "end-of-tenancy-cleaning": {
    shortDesc: "End of tenancy cleaning in Liverpool, Prescot, Runcorn, Widnes, Warrington and across Merseyside. We provide a thorough clean to prepare your property for handover. Fixed prices are shown when booking. Oven, hob and extractor cleaning are optional extras charged separately.",
    icon: "KeyRound",
    badge: "Inspection Ready",
    heroImage: "/services/tenancy.jpg"
  }
};

/**
 * Retrieves categories combined with their live database products/services.
 * All prices, names, widths, and times come directly from the PostgreSQL database.
 */
export async function getDbCategoriesWithServices() {
  try {
    const dbCategories = await getAllCategories();
    const dbServices = await getAllServices();

    if (!dbCategories || dbCategories.length === 0) {
      return SERVICE_CATEGORIES;
    }

    return dbCategories.map((cat) => {
      const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
      const meta = CATEGORY_META[slug] || {};

      // Filter services belonging to this category
      const catServices = (dbServices || []).filter((s) => s.category_id === cat.id);

      return {
        id: slug.replace("-cleaning", "") === "end-of-tenancy" ? "tenancy" : slug.replace("-cleaning", ""),
        db_id: cat.id,
        title: cat.name,
        slug: slug,
        shortDesc: meta.shortDesc || `${cat.name} in Liverpool and Merseyside.`,
        icon: meta.icon || "Sparkles",
        badge: meta.badge || "",
        heroImage: cat.image || meta.heroImage || "/services/oven.jpg",
        items: catServices.map((s) => ({
          id: s.slug || `service-${s.id}`,
          db_id: s.id,
          name: s.name,
          price: s.price,
          width: s.width || null,
          duration: s.time,
          time: s.time
        }))
      };
    });
  } catch (error) {
    console.warn("⚠️ Database connection error, using fallback SERVICE_CATEGORIES:", error?.message || error);
    return SERVICE_CATEGORIES;
  }
}

/**
 * Retrieve a specific category by its slug with its database services
 */
export async function getDbCategoryBySlug(slug) {
  const all = await getDbCategoriesWithServices();
  return all.find((c) => c.slug === slug || c.id === slug) || null;
}

/**
 * Flattened list of all database services
 */
export async function getAllDbServices() {
  const categories = await getDbCategoriesWithServices();
  return categories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      categoryId: cat.id,
      categoryTitle: cat.title
    }))
  );
}
