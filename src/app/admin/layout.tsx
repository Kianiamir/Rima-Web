import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/modules/auth/session";
import { logoutAction } from "@/modules/auth/actions";

export const metadata: Metadata = { title: "پنل مدیریت" };

const ADMIN_NAV = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/messages", label: "پیام‌ها" },
  { href: "/admin/projects", label: "نمونه‌کارها" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-6">
            <span className="font-extrabold text-primary-soft">پنل ریماوب</span>
            <nav className="flex items-center gap-1">
              {ADMIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted sm:inline">{admin.name}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-line px-4 py-2 text-xs font-bold text-muted transition hover:border-red-500/50 hover:text-red-300"
              >
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
