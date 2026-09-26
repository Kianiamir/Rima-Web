import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "درباره من",
  description: "داستان ریماوب — طراح و توسعه‌دهنده وب",
};

const SKILLS = [
  ["طراحی UI/UX", 95],
  ["توسعه فرانت‌اند", 92],
  ["توسعه بک‌اند", 85],
  ["سئو و بهینه‌سازی", 88],
] as const;

const FACTS = [
  ["+۴۰", "پروژه تحویل‌شده"],
  ["۷ سال", "تجربه"],
  ["+۲۵", "مشتری خوشحال"],
  ["۱۰۰٪", "تعهد به زمان‌بندی"],
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-black">
          داستان <span className="text-gradient">ریماوب</span>
        </h1>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[280px_1fr]">
          <div
            className="mx-auto flex h-64 w-64 items-center justify-center rounded-[26px] border border-line"
            style={{
              background:
                "radial-gradient(180px 180px at 30% 25%, rgba(124,108,255,.5), rgba(21,24,36,.2)), var(--color-surface)",
            }}
          >
            <span className="text-8xl font-black text-gradient">ر</span>
          </div>
          <div className="text-[15.5px] leading-9 text-ink/90">
            <p>
              ریماوب از یک ایده‌ی ساده شروع شد: وب‌سایت‌ها نباید فقط «شیک» باشند؛
              باید برای کسب‌وکار شما <b className="text-ink">مشتری بیاورند</b>.
            </p>
            <p className="mt-5">
              بیش از ۷ سال است در دنیای وب زندگی می‌کنم — از رستوران‌ها و
              آرایشگاه‌هایی که نوبت آنلاین می‌گیرند تا آکادمی‌هایی که دوره
              می‌فروشند. در هر پروژه اول به هدف کسب‌وکار گوش می‌دهم، بعد طراحی
              می‌کنم و در نهایت با کدی تمیز و سریع پیاده‌سازی می‌کنم.
            </p>
            <p className="mt-5">
              باور من این است که تفاوت یک وب‌سایت معمولی با یک وب‌سایت خوب، در
              جزئیات است: سرعت باز شدن، سادگی مسیر خرید، و اعتمادی که در همان
              چند ثانیه‌ی اول ساخته می‌شود.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {FACTS.map(([b, s]) => (
            <div key={s} className="rounded-2xl border border-line bg-surface px-4 py-6 text-center">
              <b className="block text-2xl font-black text-primary-soft">{b}</b>
              <span className="mt-1 block text-xs font-semibold text-muted">{s}</span>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-black">مهارت‌ها</h2>
        <div className="mt-7 grid gap-5">
          {SKILLS.map(([label, pct]) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-bold">{label}</span>
                <span className="text-muted">{pct}٪</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-primary to-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[24px] border border-primary/35 bg-gradient-to-l from-accent/8 to-primary/16 p-10 text-center">
          <h2 className="text-2xl font-black">بیا با هم شروع کنیم</h2>
          <p className="mt-3 text-sm text-muted">اولین مشاوره رایگان است — بدون تعهد</p>
          <Link
            href="/contact"
            className="btn-glow mt-6 inline-block rounded-xl bg-primary px-8 py-3 font-bold text-white transition hover:bg-primary-dark"
          >
            تماس با من
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
