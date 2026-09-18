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
    shortDesc: "Kitchen cleaning across Liverpool, Merseyside, Wirral and Warrington. We degrease cupboard fronts, tiles, hobs, splashbacks and appliances using biodegradable, fume-free products that are safe for families and pets.",
    icon: "UtensilsCrossed",
    badge: "Essential",
    heroImage: "/services/kitchen.jpg",
    items: [
      { id: "small-kitchen", name: "Small Kitchen ", price: 105, width: "Approx. 70 sq. ft", duration: "2 – 3 hrs", popular: true },
      { id: "medium-kitchen", name: "Medium Kitchen ", price: 130, width: "Approx. 200 sq. ft", duration: "2 – 4 hrs", popular: true },
      { id: "large-kitchen", name: "Large Kitchen ", price: 155, width: "Approx. 720 sq. ft", duration: "3 – 5 hrs" },
      { id: "splashback", name: "Splashback", price: 10, width: "60 – 90cm", duration: "20 min" },
    ]
  },
  {
    id: "appliances",
    title: "Appliances Cleaning",
    slug: "appliances-cleaning",
    shortDesc: "Fridge, freezer, dishwasher and washing machine cleaning in Liverpool, Knowsley, St Helens and the Wirral. We descale, sanitise and deodorise the interior using non-caustic products — safe to use immediately after.",
    icon: "Refrigerator",
    badge: "Eco-Fresh",
    heroImage: "/services/appliances.jpg",
    items: [
      { id: "american-fridge", name: "American Style Fridge / Freezer", price: 55, width: "Approx. 80 sq. ft capacity", duration: "30 – 50 min", popular: true },
      { id: "standard-fridge", name: "Standard Fridge / Freezer", price: 35, width: "Approx. 65-80 sq. ft", duration: "20 – 40 min", popular: true },
      { id: "dishwasher", name: "Dishwasher Machine Clean", price: 25, width: "Standard 60cm", duration: "20 – 40 min" },
      { id: "washing-machine", name: "Washing Machine Clean", price: 25, width: "Standard", duration: "10 – 35 min" },
    ]
  },
  {
    id: "bbq",
    title: "BBQ Cleaning",
    slug: "bbq-cleaning",
    shortDesc: "BBQ cleaning in Liverpool, Southport, Formby and across Merseyside. We remove baked-on carbon and grease from grates, burners and the firebox using food-safe, non-caustic products — ready to grill on the same day.",
    icon: "Beef",
    badge: "Summer Favorite",
    heroImage: "/services/bbq.jpg",
    items: [
      { id: "small-bbq", name: "Small Round BBQ (e.g. Weber Kettle)", price: 60, width: "Approx. 30-60 sq. ft", duration: "1 – 2 hrs" },
      { id: "medium-bbq", name: "Medium Sized BBQ (2-3 burners)", price: 65, width: "Approx. 50-80 sq. ft", duration: "1 – 2.5 hrs", popular: true },
      { id: "large-bbq", name: "Large BBQ / Outdoor Kitchen (4+ burners)", price: 80, width: "Approx. 80-120 sq. ft", duration: "2 – 3.5 hrs" },
    ]
  },
  {
    id: "bathroom",
    title: "Bathroom Cleaning",
    slug: "bathroom-cleaning",
    shortDesc: "Bathroom cleaning across Liverpool, Sefton, Halton and the wider Merseyside area. We remove limescale, treat grout and mould, and clean sanitary ware using fume-free, biodegradable products — safe for children and pets.",
    icon: "Bath",
    badge: "Hygienic",
    heroImage: "/services/bathroom.jpg",
    items: [
      { id: "bath-1", name: "Bathroom with Shower or Bath", price: 60, width: "Standard bathroom", duration: "40 min – 1 hr", popular: true },
      { id: "bath-2", name: "Two Bathrooms", price: 95, width: "2 bathrooms", duration: "1 – 2.5 hrs", popular: true },
      { id: "bath-3", name: "Three Bathrooms", price: 130, width: "3 bathrooms", duration: "2 – 4 hrs" },
      { id: "shower-cabin", name: "Shower Cabin ", price: 35, width: "Enclosed cabin", duration: "30 – 50 min" },
    ]
  },
  {
    id: "house",
    title: "House Cleaning",
    slug: "house-cleaning",
    shortDesc: "House cleaning in Liverpool, Bootle, Crosby, Ormskirk and surrounding areas. A thorough clean of all rooms using non-toxic, family-safe products — priced clearly by property size with no hidden extras.",
    icon: "Home",
    badge: "Full Care",
    heroImage: "/services/house.jpg",
    items: [
      { id: "house-studio", name: "Studio Apartment ", price: 130, duration: "2 – 4 hrs" },
      { id: "house-1bed-apt", name: "1 Bed Apartment ", price: 150, duration: "2 – 4 hrs", popular: true },
      { id: "house-2bed-apt", name: "2 Bed Apartment ", price: 170, duration: "3 – 6 hrs", popular: true },
      { id: "house-3bed-apt", name: "3 Bed Apartment ", price: 190, duration: "4 – 7 hrs" },
    ]
  },
  {
    id: "tenancy",
    title: "End of Tenancy Cleaning",
    slug: "end-of-tenancy-cleaning",
    shortDesc: "End of tenancy cleaning in Liverpool, Prescot, Runcorn, Widnes, Warrington and across Merseyside. We clean to estate agent and landlord standard to help you get your deposit back, with all prices fixed and no surprise charges.",
    icon: "KeyRound",
    badge: "100% Deposit Pass",
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
