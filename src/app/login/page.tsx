import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { getSessionAdmin } from "@/modules/auth/session";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "ورود به پنل مدیریت" };

export default async function LoginPage() {
  if (await getSessionAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="hero-glow fixed inset-0 -z-10" />
      <div className="w-full max-w-sm rounded-[24px] border border-line bg-surface/60 p-8 backdrop-blur">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Logo />
          <h1 className="text-lg font-extrabold">ورود به پنل مدیریت</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
