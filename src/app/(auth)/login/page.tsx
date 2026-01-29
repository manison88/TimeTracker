import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthForm } from "@/components/auth/auth-form";

export const runtime = "edge";

export const metadata = {
  title: "Sign In - TimeTracker",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <AuthForm mode="login" />;
}
