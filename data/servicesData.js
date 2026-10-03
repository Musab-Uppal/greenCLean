export const SERVICE_CATEGORIES = [
  {
    id: "oven",
    title: "Oven Cleaning",
    slug: "oven-cleaning",
    shortDesc: "Oven cleaning in Liverpool and surrounding areas including Wirral, Warrington, St Helens, Southport and Chester. We use a van-mounted heated dip tank with non-caustic, fume-free solution — no harsh smells, safe to cook in straight after.",
    icon: "Flame",
    badge: "Most Popular",
    heroImage: "/services/oven.jpg",
    items: [
      { id: "single-oven", name: "Single Oven", price: 60, width: "60cm", racks: 2, doors: 1, duration: "40 min – 1 hr", popular: true },
      { id: "large-single-oven", name: "Large Single Oven", price: 65, width: "90cm", racks: 2, doors: 1, duration: "1 – 1.5 hrs" },
      { id: "double-oven", name: "Double Oven", price: 75, width: "70cm", racks: 3, doors: 2, duration: "1 – 2 hrs", popular: true },
      { id: "large-double-oven", name: "Large Double Oven", price: 90, width: "90cm", racks: 2, doors: 2, duration: "1 – 2 hrs" },
    ]
  },
  {
    id: "kitchen",
    title: "Kitchen Cleaning",
    slug: "kitchen-cleaning",
    shortDesc: "Kitchen cleaning across Liverpool, Merseyside, Wirral and Warrington. We clean cupboard fronts, worktops, tiles, splashbacks, sinks and appliance exteriors using eco-friendly products. Oven, hob and extractor cleaning are available at an additional cost.",
    icon: "UtensilsCrossed",
    badge: "Essential",
    heroImage: "/services/kitchen.jpg",
    items: [
      { id: "small-kitchen", name: "Small Kitchen", price: 105, width: "Up to 8 m²", duration: "2 – 3 hrs", popular: true },
      { id: "medium-kitchen", name: "Medium Kitchen", price: 130, width: "Over 8–15 m²", duration: "2 – 4 hrs", popular: true },
      { id: "large-kitchen", name: "Large Kitchen", price: 155, width: "Over 15–25 m²", duration: "3 – 5 hrs" },
      { id: "splashback", name: "Splashback", price: 10, width: "60 – 90cm", duration: "20 min" },
    ]
  },
  {
    id: "appliances",
    title: "Appliance Cleaning",
    slug: "appliances-cleaning",
    shortDesc: "Fridge, freezer, dishwasher and washing machine cleaning in Liverpool, Knowsley, St Helens and the Wirral. We use non-caustic products to clean appliance interiors, with descaling where needed.",
    icon: "Refrigerator",
    badge: "Eco-Fresh",
    heroImage: "/services/appliances.jpg",
    items: [
      { id: "american-fridge", name: "American-Style Fridge Freezer", price: 55, width: "Includes cleaning of both the fridge and freezer compartments.", duration: "30 – 50 min", popular: true },
      { id: "standard-fridge", name: "Standard Fridge Freezer", price: 35, width: "Includes cleaning of both the fridge and freezer compartments.", duration: "20 – 40 min", popular: true },
      { id: "dishwasher", name: "Dishwasher Cleaning", price: 25, width: "60 cm", duration: "20 – 40 min" },
      { id: "washing-machine", name: "Washing Machine Cleaning", price: 25, width: null, duration: "10 – 35 min" },
    ]
  },
  {
    id: "bbq",
    title: "BBQ Cleaning",
    slug: "bbq-cleaning",
    shortDesc: "BBQ cleaning in Liverpool, Southport, Formby and across Merseyside. We remove baked-on carbon and grease from grates, burners and the firebox using food-safe, non-caustic products — ready to grill on the same day.",
    icon: "Beef",
    badge: "Summer Favourite",
    heroImage: "/services/bbq.jpg",
    items: [
      { id: "small-bbq", name: "Small Round BBQ (e.g. Weber Kettle)", price: 60, width: null, duration: "1 – 2 hrs" },
      { id: "medium-bbq", name: "Medium Sized BBQ (2-3 burners)", price: 65, width: null, duration: "1 – 2.5 hrs", popular: true },
      { id: "large-bbq", name: "Large BBQ (4+ burners)", price: 80, width: null, duration: "2 – 3.5 hrs" },
    ]
  },
  {
    id: "bathroom",
    title: "Bathroom Cleaning",
    slug: "bathroom-cleaning",
    shortDesc: "Bathroom cleaning across Liverpool, Sefton, Halton and the wider Merseyside area. We clean baths, showers, toilets, sinks and tiles, tackling limescale and soap residue with eco-friendly cleaning products.",
    icon: "Bath",
    badge: "Hygienic",
    heroImage: "/services/bathroom.jpg",
    items: [
      { id: "bath-1", name: "Bathroom with Shower or Bath", price: 60, width: "Includes: 1 standard bathroom", duration: "40 min – 1 hr", popular: true },
      { id: "bath-2", name: "Two Bathrooms", price: 95, width: "Includes: 2 standard bathrooms", duration: "1 – 2.5 hrs", popular: true },
      { id: "bath-3", name: "Three Bathrooms", price: 130, width: "Includes: 3 standard bathrooms", duration: "2 – 4 hrs" },
      { id: "shower-cabin", name: "Shower Cabin ", price: 35, width: "Includes: Shower enclosure only", duration: "30 – 50 min" },
    ]
  },
  {
    id: "house",
    title: "House Cleaning",
    slug: "house-cleaning",
    shortDesc: "Professional house cleaning in Liverpool, Bootle, Crosby, Ormskirk and surrounding areas. Regular cleaning is £22 per hour, with a minimum booking of 2 hours. Deep cleaning is available at fixed prices based on property size. We bring our own equipment and eco-friendly cleaning products.",
    icon: "Home",
    badge: "Full Care",
    heroImage: "/services/house.jpg",
    items: [
      { id: "house-studio", name: "Studio Apartment", price: 130, width: "Studio flat", duration: "2 – 4 hrs" },
      { id: "house-1bed-apt", name: "1 Bed Apartment", price: 150, width: "1 bed flat", duration: "2 – 4 hrs", popular: true },
      { id: "house-2bed-apt", name: "2 Bed Apartment", price: 170, width: "2 bed flat", duration: "3 – 6 hrs", popular: true },
      { id: "house-3bed-apt", name: "3 Bed Apartment", price: 190, width: "3 bed flat", duration: "4 – 7 hrs" },
      { id: "house-1bed", name: "1 Bed House", price: 170, width: "1 bed house", duration: "3 – 5 hrs" },
      { id: "house-2bed", name: "2 Bed House", price: 190, width: "2 bed house", duration: "3.5 – 6 hrs" },
      { id: "house-3bed", name: "3 Bed House", price: 230, width: "3 bed house", duration: "4.5 – 7.5 hrs" },
      { id: "house-4bed", name: "4 Bed House", price: 260, width: "4 bed house", duration: "5 – 9 hrs" },
    ]
  },
  {
    id: "tenancy",
    title: "End of Tenancy Cleaning",
    slug: "end-of-tenancy-cleaning",
    shortDesc: "End of tenancy cleaning in Liverpool, Prescot, Runcorn, Widnes, Warrington and across Merseyside. We provide a thorough clean to prepare your property for handover. Fixed prices are shown when booking. Oven, hob and extractor cleaning are optional extras charged separately.",
    icon: "KeyRound",
    badge: "Inspection Ready",
    heroImage: "/services/tenancy.jpg",
    items: [
      { id: "eot-studio", name: "Studio Apartment End of Tenancy", price: 120, width: "Studio flat", duration: "2 – 4 hrs" },
      { id: "eot-1bed-apt", name: "1 Bed Apartment End of Tenancy", price: 140, width: "1 bed flat", duration: "3 – 4 hrs", popular: true },
      { id: "eot-2bed-apt", name: "2 Bed Apartment End of Tenancy", price: 160, width: "2 bed flat", duration: "3 – 6 hrs", popular: true },
      { id: "eot-3bed-apt", name: "3 Bed Apartment End of Tenancy", price: 180, width: "3 bed flat", duration: "4 – 7 hrs" },
      { id: "eot-1bed-house", name: "1 Bed House End of Tenancy", price: 170, width: "1 bed house", duration: "3 – 5 hrs" },
      { id: "eot-2bed-house", name: "2 Bed House End of Tenancy", price: 190, width: "2 bed house", duration: "4 – 6 hrs" },
      { id: "eot-3bed-house", name: "3 Bed House End of Tenancy", price: 230, width: "3 bed house", duration: "5 – 8 hrs" },
      { id: "eot-4bed-house", name: "4 Bed House End of Tenancy", price: 260, width: "4 bed house", duration: "6 – 9 hrs" },
    ]
  }
];

export const ALL_SERVICES = SERVICE_CATEGORIES.flatMap(cat =>
  cat.items.map(item => ({ ...item, categoryId: cat.id, categoryTitle: cat.title }))
);
