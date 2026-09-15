import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    icon: "/favicon.ico",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
