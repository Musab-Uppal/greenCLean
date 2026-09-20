import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default function DecoyAdminPage() {
  // Return standard Next.js 404 page
  notFound();
}
