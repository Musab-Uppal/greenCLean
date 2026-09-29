import { redirect } from "next/navigation";

// User dashboard removed — redirect to homepage
export default function DashboardPage() {
  redirect("/");
}
