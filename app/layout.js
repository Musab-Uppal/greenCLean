import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteLayoutWrapper from "@/components/SiteLayoutWrapper";
import { getDbCategoriesWithServices } from "@/lib/servicesDb";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Green Clean Group | Eco-Friendly Oven & Home Cleaning in Liverpool",
  description: "Liverpool's premier non-toxic, eco-friendly oven and home cleaning service. 100% plant-based products, fully insured, family-run, and satisfaction guaranteed. Book online in 60 seconds.",
  keywords: [
    "Oven cleaning Liverpool",
    "Eco friendly cleaning Merseyside",
    "BBQ cleaning Liverpool",
    "End of tenancy cleaning Liverpool",
    "Kitchen deep clean Liverpool",
    "Green Clean Group"
  ],
  authors: [{ name: "Green Clean Group" }],
  icons: {
    icon: "/fav.jpg",
    shortcut: "/fav.jpg",
    apple: "/fav.jpg",
  },
  openGraph: {
    title: "Green Clean Group | Eco-Friendly Cleaning in Liverpool",
    description: "Professional oven and home cleaning services in Liverpool. 100% plant-based, non-caustic formulas. Book online today!",
    url: "https://greencleangroup.co.uk/",
    siteName: "Green Clean Group",
    locale: "en_GB",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  let categories = [];
  try {
    categories = await getDbCategoriesWithServices();
  } catch (err) {
    console.error("[Layout] Failed to load categories:", err?.message ?? err);
  }

  return (
    <html lang="en-GB" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <SiteLayoutWrapper categories={categories}>
            {children}
          </SiteLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
