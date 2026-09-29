import { redirect } from "next/navigation";

// Login is no longer required — redirect to homepage
export default function LoginPage() {
  redirect("/");
}
