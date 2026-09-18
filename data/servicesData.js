export const SERVICE_CATEGORIES = [
  {
    id: "oven",
    title: "Oven Cleaning",
    slug: "oven-cleaning",
    shortDesc: "Specialist eco-friendly dipping tank cleaning that leaves your oven spotless without toxic fumes.",
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
    shortDesc: "Complete degreasing, deep sanitization of counters, tiles, cupboards and surfaces with plant-based formulas.",
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
    shortDesc: "Thorough de-scaling, internal sanitization and odor neutralisation for all large and small kitchen appliances.",
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
    shortDesc: "Heavy-duty carbon removal and food-safe sanitization for kettle, gas, and premium outdoor grills.",
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
    shortDesc: "Complete limescale removal, grout scrubbing, mold treatment and hygienic shine for all sanitary ware.",
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
    shortDesc: "Comprehensive top-to-bottom domestic cleaning customized for flats, apartments, and family houses.",
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
    shortDesc: "Guaranteed deposit-return cleaning compliant with UK estate agency and landlord inspection checklists.",
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
