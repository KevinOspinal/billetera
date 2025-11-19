import LoginForm from "./LoginForm";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
