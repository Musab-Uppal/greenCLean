import React from "react";

/**
 * Renders JSON-LD structured data inside a <script> tag for search engines.
 * Accepts either a single schema object or an array of schema objects.
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}
