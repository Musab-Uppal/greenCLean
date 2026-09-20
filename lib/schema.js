/**
 * Schema.org JSON-LD generators for Green Clean Group
 * Generates valid structured data for search engines (Google, Bing, etc.)
 */

export const SITE_URL = "https://greencleangroup.co.uk";
export const BUSINESS_NAME = "Green Clean Group";
export const BUSINESS_PHONE = "07359068284";
export const BUSINESS_EMAIL = "contact@greencleangroup.co.uk";

/**
 * Generates LocalBusiness / CleaningService schema
 */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CleaningService",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS_NAME,
    alternateName: "Green Clean Group Liverpool",
    url: SITE_URL,
    logo: `${SITE_URL}/fav.jpg`,
    image: `${SITE_URL}/hero-before-after.jpg`,
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    priceRange: "££",
    paymentAccepted: "Cash, Credit Card, Debit Card, PayPal",
    currenciesAccepted: "GBP",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Liverpool",
      addressRegion: "Merseyside",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 53.4084,
      longitude: -2.9916,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "19:00",
      },
    ],
    areaServed: [
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 53.4084,
          longitude: -2.9916,
        },
        geoRadius: "64374", // 40 miles in metres
        description: "40-mile service radius from Liverpool City Centre",
      },
      { "@type": "AdministrativeArea", name: "Liverpool" },
      { "@type": "AdministrativeArea", name: "Merseyside" },
      { "@type": "AdministrativeArea", name: "Wirral" },
      { "@type": "AdministrativeArea", name: "Warrington" },
      { "@type": "AdministrativeArea", name: "Chester" },
      { "@type": "AdministrativeArea", name: "St Helens" },
      { "@type": "AdministrativeArea", name: "Southport" },
      { "@type": "AdministrativeArea", name: "Knowsley" },
      { "@type": "AdministrativeArea", name: "Sefton" },
    ],
    sameAs: [
      "https://facebook.com/greencleangroup",
      "https://instagram.com/greencleangroup",
    ],
  };
}

/**
 * Generates Service + Offer schema dynamically from a category data object
 * @param {Object} category - The category object from servicesDb / servicesData
 */
export function getServiceSchema(category) {
  if (!category) return null;

  const serviceUrl = `${SITE_URL}/services/${category.slug}`;

  const offers = (category.items || []).map((item) => ({
    "@type": "Offer",
    name: item.name,
    description: `${item.name} - Professional ${category.title} in Liverpool & Merseyside`,
    price: String(item.price),
    priceCurrency: "GBP",
    availability: "https://schema.org/InStock",
    url: serviceUrl,
    priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
    seller: {
      "@type": "CleaningService",
      name: BUSINESS_NAME,
      telephone: BUSINESS_PHONE,
      url: SITE_URL,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: `${category.title} in Liverpool`,
    serviceType: category.title,
    description: category.shortDesc || `${category.title} provided by ${BUSINESS_NAME} across Liverpool and Merseyside.`,
    provider: {
      "@type": "CleaningService",
      "@id": `${SITE_URL}/#business`,
      name: BUSINESS_NAME,
      url: SITE_URL,
      telephone: BUSINESS_PHONE,
      email: BUSINESS_EMAIL,
    },
    areaServed: [
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 53.4084,
          longitude: -2.9916,
        },
        geoRadius: "64374",
        description: "40-mile service radius from Liverpool City Centre",
      },
      {
        "@type": "AdministrativeArea",
        name: "Liverpool & Merseyside",
      },
    ],
    offers: offers,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${category.title} Packages`,
      itemListElement: offers,
    },
  };
}

/**
 * Generates FAQPage schema dynamically from FAQ items
 * @param {Array<{question: string, answer: string}>} faqs
 */
export function getFaqSchema(faqs) {
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
