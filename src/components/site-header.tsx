import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/", label: "خانه" },
  { href: "/works", label: "نمونه‌کارها" },
  { href: "/about", label: "درباره من" },
  { href: "/contact", label: "تماس" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-dashed border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-[78px] max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="ریماوب — خانه" className="text-ink">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-1.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-bold text-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-hard btn-hard-primary mx-2 !px-5 !py-2.5 !text-sm">
            سفارش پروژه
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
