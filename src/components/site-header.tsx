import Link from "next/link";
import { Logo } from "./logo";

const NAV = [
  { href: "/", label: "خانه" },
  { href: "/works", label: "نمونه‌کارها" },
  { href: "/about", label: "درباره من" },
  { href: "/contact", label: "تماس" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="ریماوب — خانه">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="btn-glow mr-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            سفارش پروژه
          </Link>
        </nav>
      </div>
    </header>
  );
}
