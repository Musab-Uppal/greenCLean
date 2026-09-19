import { db, getAllCategories, getAllServices } from "./db.js";

// Visual / Presentation metadata mapped by category slug
const CATEGORY_META = {
  "oven-cleaning": {
    shortDesc: "Oven cleaning in Liverpool and surrounding areas including Wirral, Warrington, St Helens, Southport and Chester. We use a van-mounted heated dip tank with non-caustic, fume-free solution — no harsh smells, safe to cook in straight after.",
    icon: "Flame",
    badge: "Most Popular",
    heroImage: "/services/oven.jpg"
  },
  "kitchen-cleaning": {
    shortDesc: "Kitchen cleaning across Liverpool, Merseyside, Wirral and Warrington. We degrease cupboard fronts, tiles, hobs, splashbacks and appliances using biodegradable, fume-free products that are safe for families and pets.",
    icon: "UtensilsCrossed",
    badge: "Essential",
    heroImage: "/services/kitchen.jpg"
  },
  "appliances-cleaning": {
    shortDesc: "Fridge, freezer, dishwasher and washing machine cleaning in Liverpool, Knowsley, St Helens and the Wirral. We descale, sanitise and deodorise the interior using non-caustic products — safe to use immediately after.",
    icon: "Refrigerator",
    badge: "Eco-Fresh",
    heroImage: "/services/appliances.jpg"
  },
  "bbq-cleaning": {
    shortDesc: "BBQ cleaning in Liverpool, Southport, Formby and across Merseyside. We remove baked-on carbon and grease from grates, burners and the firebox using food-safe, non-caustic products — ready to grill on the same day.",
    icon: "Beef",
    badge: "Summer Favorite",
    heroImage: "/services/bbq.jpg"
  },
  "bathroom-cleaning": {
    shortDesc: "Bathroom cleaning across Liverpool, Sefton, Halton and the wider Merseyside area. We remove limescale, treat grout and mould, and clean sanitary ware using fume-free, biodegradable products — safe for children and pets.",
    icon: "Bath",
    badge: "Hygienic",
    heroImage: "/services/bathroom.jpg"
  },
  "house-cleaning": {
    shortDesc: "House cleaning in Liverpool, Bootle, Crosby, Ormskirk and surrounding areas. A thorough clean of all rooms using non-toxic, family-safe products — priced clearly by property size with no hidden extras.",
    icon: "Home",
    badge: "Full Care",
    heroImage: "/services/house.jpg"
  },
  "end-of-tenancy-cleaning": {
    shortDesc: "End of tenancy cleaning in Liverpool, Prescot, Runcorn, Widnes, Warrington and across Merseyside. We clean to estate agent and landlord standard to help you get your deposit back, with all prices fixed and no surprise charges.",
    icon: "KeyRound",
    badge: "100% Deposit Pass",
    heroImage: "/services/tenancy.jpg"
  }
};

/**
 * Retrieves categories combined with their live database products/services.
 * All prices, names, widths, and times come directly from the SQLite database.
 */
export function getDbCategoriesWithServices() {
  const dbCategories = getAllCategories();
  const dbServices = getAllServices();

  return dbCategories.map((cat) => {
    const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
    const meta = CATEGORY_META[slug] || {};
    
    // Filter services belonging to this category
    const catServices = dbServices.filter((s) => s.category_id === cat.id);

    return {
      id: slug.replace("-cleaning", "") === "end-of-tenancy" ? "tenancy" : slug.replace("-cleaning", ""),
      db_id: cat.id,
      title: cat.name,
      slug: slug,
      shortDesc: meta.shortDesc || `${cat.name} in Liverpool and Merseyside.`,
      icon: meta.icon || "Sparkles",
      badge: meta.badge || "",
      heroImage: meta.heroImage || "/services/oven.jpg",
      items: catServices.map((s) => ({
        id: s.slug || `service-${s.id}`,
        db_id: s.id,
        name: s.name,
        price: s.price,
        width: s.width || null,
        duration: s.time,
        time: s.time,
        popular: Boolean(s.popular)
      }))
    };
  });
}

/**
 * Retrieve a specific category by its slug with its database services
 */
export function getDbCategoryBySlug(slug) {
  const all = getDbCategoriesWithServices();
  return all.find((c) => c.slug === slug || c.id === slug) || null;
}

/**
 * Flattened list of all database services
 */
export function getAllDbServices() {
  const categories = getDbCategoriesWithServices();
  return categories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      categoryId: cat.id,
      categoryTitle: cat.title
    }))
  );
}
