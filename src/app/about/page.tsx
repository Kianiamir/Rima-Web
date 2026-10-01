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
        <div className="text-[13.5px] font-extrabold tracking-wide text-primary">— درباره من</div>
        <h1 className="mt-3 text-4xl font-black">
          داستان <span className="text-primary">ریماوب</span>
        </h1>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[280px_1fr]">
          <div
            className="mx-auto flex h-[320px] w-[280px] items-end justify-center rounded-t-full border-2 border-ink pb-6"
            style={{ background: "linear-gradient(160deg, #C7D2FE, #4F46E5)" }}
          >
            <span className="text-6xl font-black text-white">ریما</span>
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
            <div
              key={s}
              className="rounded-[18px] border-2 border-ink bg-surface px-4 py-6 text-center shadow-[4px_4px_0_var(--color-line)]"
            >
              <b className="block text-2xl font-black text-primary">{b}</b>
              <span className="mt-1 block text-xs font-bold text-muted">{s}</span>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-black">مهارت‌ها</h2>
        <div className="mt-7 grid gap-5">
          {SKILLS.map(([label, pct]) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-bold">{label}</span>
                <span className="font-semibold text-muted">{pct}٪</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border-2 border-ink bg-surface">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[28px] border-2 border-ink bg-ink p-10 text-center text-bg shadow-[6px_6px_0_var(--color-primary)]">
          <h2 className="text-2xl font-black">
            بیا با هم <span className="text-accent">شروع کنیم</span>
          </h2>
          <p className="mt-3 text-sm font-medium text-bg/70">اولین مشاوره رایگان است — بدون تعهد</p>
          <Link href="/contact" className="btn-hard btn-hard-inverse mt-6">
            تماس با من
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
