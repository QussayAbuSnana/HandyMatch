import { redirect } from "next/navigation";

// Root always sends users to /login.
// The login page handles redirecting already-authenticated users to their dashboard.
export default function Root() {
  redirect("/login");
}
