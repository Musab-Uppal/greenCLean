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
      { id: "triple-oven", name: "Triple Oven", price: 120, width: "100-110cm", racks: 4, doors: 3, duration: "2 – 2.5 hrs" },
      { id: "aga-2-oven", name: "AGA with 2 Ovens", price: 95, width: "Standard Range", racks: 4, doors: 2, duration: "2 – 3 hrs" },
      { id: "aga-3-oven", name: "AGA with 3 Ovens", price: 110, width: "Deluxe Range", racks: 6, doors: 3, duration: "2.5 – 3.5 hrs" },
      { id: "aga-4-oven", name: "AGA with 4 Ovens", price: 135, width: "Grand Range", racks: 8, doors: 4, duration: "3 – 4 hrs" },
      { id: "gas-hob", name: "Gas Hob Clean", price: 20, width: "Up to 5 burners", racks: 0, doors: 0, duration: "25 – 40 min" },
      { id: "electric-hob", name: "Electric Hob Clean", price: 20, width: "Standard", racks: 0, doors: 0, duration: "20 – 30 min" },
      { id: "ceramic-hob", name: "Ceramic Hob Clean", price: 10, width: "Standard glass", racks: 0, doors: 0, duration: "15 – 20 min" },
      { id: "oven-bulb", name: "Oven Bulb Replacement", price: 6, width: "Universal heat-proof", racks: 0, doors: 0, duration: "5 min" },
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
      { id: "small-kitchen", name: "Small Kitchen Deep Clean", price: 105, width: "Approx. 70 sq. ft", duration: "2 – 3 hrs", popular: true },
      { id: "medium-kitchen", name: "Medium Kitchen Deep Clean", price: 130, width: "Approx. 200 sq. ft", duration: "2 – 4 hrs", popular: true },
      { id: "large-kitchen", name: "Large Kitchen Deep Clean", price: 155, width: "Approx. 720 sq. ft", duration: "3 – 5 hrs" },
      { id: "splashback", name: "Splashback Deep Degrease", price: 10, width: "60 – 90cm", duration: "20 min" },
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
      { id: "tumble-dryer", name: "Tumble Dryer Machine", price: 20, width: "Standard", duration: "15 – 30 min" },
      { id: "small-microwave", name: "Small Microwave Clean", price: 15, width: "Up to 25L", duration: "15 – 20 min" },
      { id: "combined-microwave", name: "Combined Microwave / Grill Oven", price: 45, width: "Built-in / Free", duration: "30 – 45 min" },
      { id: "extractor-fan", name: "Extractor Fan & Hood Degrease", price: 20, width: "60-90cm", duration: "25 – 40 min" },
      { id: "extractor-bulb", name: "Extractor Fan Bulb Replacement", price: 5, width: "Standard", duration: "5 min" },
      { id: "extractor-filter", name: "Extractor Carbon Filters Replacement", price: 10, width: "Twin pack", duration: "10 min" },
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
      { id: "bath-shower-combo", name: "Bathroom with Separate Shower & Bath", price: 75, width: "Full en-suite", duration: "1 – 1.5 hrs" },
      { id: "bath-2", name: "Two Complete Bathrooms", price: 95, width: "2 bathrooms", duration: "1 – 2.5 hrs", popular: true },
      { id: "bath-3", name: "Three Complete Bathrooms", price: 130, width: "3 bathrooms", duration: "2 – 4 hrs" },
      { id: "shower-cabin", name: "Individual Shower Cabin Deep Clean", price: 35, width: "Enclosed cabin", duration: "30 – 50 min" },
      { id: "toilet-clean", name: "Additional Toilet / Cloakroom", price: 25, width: "Single cloakroom", duration: "20 min" },
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
      { id: "house-studio", name: "Studio Apartment Deep Clean", price: 130, width: "Studio", duration: "2 – 4 hrs" },
      { id: "house-1bed-apt", name: "1 Bed Apartment Deep Clean", price: 150, width: "1 bedroom flat", duration: "2 – 4 hrs", popular: true },
      { id: "house-2bed-apt", name: "2 Bed Apartment Deep Clean", price: 170, width: "2 bedroom flat", duration: "3 – 6 hrs", popular: true },
      { id: "house-3bed-apt", name: "3 Bed Apartment Deep Clean", price: 190, width: "3 bedroom flat", duration: "4 – 7 hrs" },
      { id: "house-1bed", name: "1 Bed House Deep Clean", price: 170, width: "1 bedroom house", duration: "3 – 5 hrs" },
      { id: "house-2bed", name: "2 Bed House Deep Clean", price: 190, width: "2 bedroom house", duration: "3.5 – 6 hrs" },
      { id: "house-3bed", name: "3 Bed House Deep Clean", price: 230, width: "3 bedroom house", duration: "4.5 – 7.5 hrs" },
      { id: "house-4bed", name: "4 Bed House Deep Clean", price: 260, width: "4 bedroom house", duration: "5 – 9 hrs" },
      { id: "hourly-cleaning", name: "General Clean - By The Hour", price: 22, width: "Min 3 hours", duration: "Hourly", note: "Per cleaner / hour" },
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
