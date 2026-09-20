"use client";

import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayoutWrapper({ categories, children }) {
  const pathname = usePathname();

  // Check if current route is the admin page or any admin path
  const isAdminRoute =
    pathname?.startsWith("/adminpage") ||
    pathname?.startsWith("/admin");

  // On admin portal routes, remove normal customer header, announcement bar, and normal footer completely.
  // The admin portal renders its own dedicated administrative header and controls.
  if (isAdminRoute) {
    return <main>{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header categories={categories} />
      <main>{children}</main>
      <Footer categories={categories} />
    </>
  );
}
