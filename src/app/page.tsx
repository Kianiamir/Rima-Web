import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectCard } from "@/components/project-card";

export const dynamic = "force-dynamic";

const SERVICES = [
  {
    title: "طراحی رابط کاربری",
    desc: "طراحی UI/UX مدرن و کاربرمحور با تمرکز بر تجربه‌ی بی‌نقص کاربر",
    icon: (
      <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" className="h-6 w-6 stroke-primary">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
      </svg>
    ),
  },
  {
    title: "توسعه وب",
    desc: "پیاده‌سازی فرانت‌اند و بک‌اند با تکنولوژی‌های روز دنیا",
    icon: (
      <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" className="h-6 w-6 stroke-primary">
        <path d="m8 8-5 4 5 4M16 8l5 4-5 4M13 5l-2 14" />
      </svg>
    ),
  },
  {
    title: "فروشگاه آنلاین",
    desc: "راه‌اندازی فروشگاه اینترنتی کامل با درگاه پرداخت و پنل مدیریت",
    icon: (
      <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" className="h-6 w-6 stroke-primary">
        <path d="M6 6h15l-1.5 8H8L6 3H3" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
      </svg>
    ),
  },
  {
    title: "سئو و بهینه‌سازی",
    desc: "بهینه‌سازی سرعت و ساختار برای دیده‌شدن در گوگل",
    icon: (
      <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" className="h-6 w-6 stroke-primary">
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </svg>
    ),
  },
];

const STEPS = [
  { n: "۱", title: "مشاوره و تحلیل", desc: "شناخت کسب‌وکار، اهداف و مخاطبان شما" },
  { n: "۲", title: "طراحی UI", desc: "طراحی چند نسخه و انتخاب با تایید شما" },
  { n: "۳", title: "توسعه", desc: "پیاده‌سازی کامل با تکنولوژی‌های مدرن" },
  { n: "۴", title: "راه‌اندازی", desc: "انتشار، آموزش و پشتیبانی پس از تحویل" },
];

export default async function HomePage() {
  const featured = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(desc(projects.featured), desc(projects.sortOrder), desc(projects.createdAt))
    .limit(3);

  return (
    <>
      <SiteHeader />

      <main>
        {/* ─── Hero ─── */}
        <section className="hero-glow relative overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-24 text-center sm:pt-28">
            <span className="fade-up inline-block rounded-full border border-accent/25 bg-accent/10 px-4.5 py-2 text-[13px] font-bold text-accent">
              ✦ طراح و توسعه‌دهنده وب
            </span>
            <h1 className="fade-up mt-7 text-4xl leading-[1.4] font-black sm:text-5xl lg:text-[56px]">
              وب‌سایتی بسازید که <span className="text-gradient">در ذهن می‌ماند</span>
            </h1>
            <p className="fade-up mx-auto mt-6 max-w-xl text-[17px] leading-8 text-muted">
              ترکیب طراحی مدرن و کدنویسی تمیز برای وب‌سایت‌هایی که سریع بارگذاری
              می‌شوند، در گوگل دیده می‌شوند و مشتری را به خریدار تبدیل می‌کنند.
            </p>
            <div className="fade-up mt-9 flex justify-center gap-3.5">
              <Link
                href="/contact"
                className="btn-glow rounded-xl bg-primary px-8 py-3.5 text-[15px] font-bold text-white transition hover:bg-primary-dark"
              >
                شروع پروژه
              </Link>
              <Link
                href="/works"
                className="rounded-xl border border-line bg-primary/5 px-8 py-3.5 text-[15px] font-bold text-ink transition hover:border-primary/50"
              >
                مشاهده نمونه‌کارها
              </Link>
            </div>
            <div className="fade-up mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4">
              {[
                ["+۴۰", "پروژه تحویل‌شده"],
                ["۷ سال", "تجربه طراحی وب"],
                ["۹۸٪", "رضایت مشتریان"],
              ].map(([b, s]) => (
                <div key={s} className="rounded-2xl border border-line bg-surface px-4 py-6">
                  <b className="block text-2xl font-black sm:text-3xl">{b}</b>
                  <span className="mt-1 block text-[13px] font-semibold text-muted">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Services ─── */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-black">
            خدمات <span className="text-primary">من</span>
          </h2>
          <p className="mt-3 text-[15px] text-muted">هرچه برای حضوری قدرتمند در وب نیاز دارید</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-[20px] border border-line bg-gradient-to-b from-primary/8 to-surface/40 p-7"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">{s.icon}</div>
                <h3 className="mb-2.5 font-bold">{s.title}</h3>
                <p className="text-[13.5px] leading-7 text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Featured works ─── */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">
                نمونه‌کارهای <span className="text-primary">منتخب</span>
              </h2>
              <p className="mt-3 text-[15px] text-muted">گزییده از پروژه‌های اخیر</p>
            </div>
            <Link href="/works" className="shrink-0 text-sm font-bold text-accent transition hover:opacity-80">
              مشاهده همه ←
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
              هنوز نمونه‌کاری منتشر نشده — از پنل مدیریت اولین پروژه را اضافه کنید.
            </p>
          )}
        </section>

        {/* ─── Process ─── */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-black">
            روند <span className="text-primary">همکاری</span>
          </h2>
          <p className="mt-3 text-[15px] text-muted">از اولین جلسه تا لانچ نهایی، شفاف و مرحله‌به‌مرحله</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-[20px] border border-line bg-surface p-7">
                <b className="mb-4.5 inline-flex h-10 w-10 items-center justify-center rounded-[13px] border border-accent/25 bg-accent/12 text-base text-accent">
                  {s.n}
                </b>
                <h3 className="mb-2 font-bold">{s.title}</h3>
                <p className="text-[13px] leading-7 text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── About snippet ─── */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[300px_1fr]">
          <div
            className="mx-auto flex h-72 w-72 items-center justify-center rounded-[28px] border border-line lg:h-[300px] lg:w-[300px]"
            style={{
              background:
                "radial-gradient(200px 200px at 30% 25%, rgba(124,108,255,.5), rgba(21,24,36,.2)), var(--color-surface)",
            }}
          >
            <span className="text-[100px] font-black text-gradient">ر</span>
          </div>
          <div>
            <h2 className="text-3xl font-black">سلام! من طراح وب هستم</h2>
            <p className="mt-4 text-[15.5px] leading-8 text-muted">
              بیش از ۷ سال است وب‌سایت می‌سازم — سایت‌هایی که هم زیبا هستند و هم
              نتیجه می‌سازند. تخصص من ترکیب طراحی مدرن با کدنویسی تمیز و سریع
              است؛ از فروشگاه آنلاین تا سامانه‌های سفارشی. اگر دنبال کسی هستید
              که هم سلیقه دارد و هم تعهد، جای درستی آمده‌اید.
            </p>
            <Link
              href="/about"
              className="btn-glow mt-7 inline-block rounded-xl bg-primary px-7 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              بیشتر درباره من
            </Link>
          </div>
        </section>

        {/* ─── CTA band ─── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-[28px] border border-primary/35 bg-gradient-to-l from-accent/8 to-primary/16 px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-black">پروژه‌ای در ذهن دارید؟</h2>
            <p className="mt-3.5 text-[15.5px] text-muted">برای مشاوره اولیه رایگان، همین حالا پیام بدهید</p>
            <Link
              href="/contact"
              className="btn-glow mt-8 inline-block rounded-xl bg-primary px-9 py-3.5 text-[15px] font-bold text-white transition hover:bg-primary-dark"
            >
              درخواست مشاوره
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
