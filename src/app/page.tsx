import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectCard } from "@/components/project-card";

export const dynamic = "force-dynamic";

const SERVICES = [
  { n: "۰۱", title: "طراحی رابط کاربری", desc: "طراحی مدرن و کاربرمحور؛ اول چند طرح می‌بینید، بعد با تایید خودتان جلو می‌رویم." },
  { n: "۰۲", title: "توسعه وب", desc: "پیاده‌سازی سریع و تمیز با جدیدترین تکنولوژی‌ها؛ بدون دردسر، بدون کندی." },
  { n: "۰۳", title: "فروشگاه آنلاین", desc: "فروشگاه کامل با درگاه پرداخت، پنل مدیریت و همه‌چیزهایی که برای فروش نیاز دارید." },
  { n: "۰۴", title: "سئو و بهینه‌سازی", desc: "تا مشتری‌ها در گوگل پیدایتان کنند؛ سرعت بالا و ساختار درست." },
];

const MARQUEE_ITEMS = [
  "طراحی وب",
  "فروشگاه آنلاین",
  "سئو",
  "رابط کاربری",
  "توسعه فرانت‌اند",
  "پنل مدیریت",
  "سرعت بالا",
  "پشتیبانی واقعی",
];

function MarqueeRow() {
  return (
    <span>
      {MARQUEE_ITEMS.map((item) => (
        <span key={item}>
          {item} <i>✦</i>{" "}
        </span>
      ))}
    </span>
  );
}

/** خط موج‌دار زیر کلمهٔ کلیدی تیتر */
function Squiggle() {
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden className="absolute -bottom-1.5 right-0 left-0 h-4 w-full">
      <path
        d="M4 12 C 50 2, 150 2, 196 10"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
          <span className="sticker absolute top-[150px] hidden lg:inline-flex" style={{ insetInlineEnd: "30px" }}>
            ✦ ظرفیت پروژه‌ی این ماه: ۲ جای خالی
          </span>

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24">
            <span className="chip-dashed fade-up">طراح و توسعه‌دهنده وب مستقل</span>
            <h1 className="fade-up mt-7 text-[42px] leading-[1.4] font-black sm:text-5xl lg:text-[62px]">
              ایده‌ی شما،
              <br />
              وب‌سایتی که{" "}
              <span className="relative inline-block whitespace-nowrap text-primary">
                می‌درخشد
                <Squiggle />
              </span>
              <br />
              در دنیای دیجیتال
            </h1>
            <p className="fade-up mt-6 max-w-[540px] text-[17px] leading-8 font-medium text-muted">
              من وب‌سایت‌هایی می‌سازم که نه‌فقط چشم‌نواز هستند، بلکه برای کسب‌وکارتان
              مشتری می‌آورند. از رستوران تا فروشگاه آنلاین — با هم می‌سازیمش.
            </p>
            <div className="fade-up mt-9 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="btn-hard btn-hard-primary !text-[15px]">
                بزن بریم 🚀
              </Link>
              <Link href="/works" className="btn-hard btn-hard-ghost !text-[15px]">
                کارهای من
              </Link>
              <span className="text-[13px] font-bold text-muted">مشاوره اولیه رایگان است</span>
            </div>
          </div>
        </section>

        {/* ─── Marquee ─── */}
        <div className="marquee" aria-hidden>
          <div className="marquee-track">
            <MarqueeRow />
            <MarqueeRow />
          </div>
        </div>

        {/* ─── Featured works ─── */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12">
            <div className="text-[13.5px] font-extrabold tracking-wide text-primary">— نمونه‌کارها</div>
            <h2 className="mt-3 text-4xl font-black">کارهایی که بهشان افتخار می‌کنم</h2>
          </div>
          {featured.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border-2 border-dashed border-line p-10 text-center text-sm font-semibold text-muted">
              هنوز نمونه‌کاری منتشر نشده — از پنل مدیریت اولین پروژه را اضافه کنید.
            </p>
          )}
          <div className="mt-12 text-center">
            <Link href="/works" className="btn-hard btn-hard-ghost">
              دیدن همه‌ی کارها
            </Link>
          </div>
        </section>

        {/* ─── Services ─── */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-4">
            <div className="text-[13.5px] font-extrabold tracking-wide text-primary">— خدمات</div>
            <h2 className="mt-3 text-4xl font-black">چیکارهایی براتون می‌کنم؟</h2>
          </div>
          <div>
            {SERVICES.map((s) => (
              <div
                key={s.n}
                className="flex items-center gap-6 border-t-2 border-line py-8 last:border-b-2 sm:gap-8"
              >
                <div className="min-w-14 text-3xl font-black text-primary">{s.n}</div>
                <div>
                  <h3 className="text-xl font-black">{s.title}</h3>
                  <p className="mt-1.5 max-w-[560px] text-sm leading-8 text-muted">{s.desc}</p>
                </div>
                <span
                  aria-hidden
                  className="ms-auto hidden h-13 w-13 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-surface text-xl sm:flex"
                >
                  ←
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── About snippet ─── */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[300px_1fr]">
          <div
            className="mx-auto flex h-[340px] w-[300px] items-end justify-center rounded-t-full border-2 border-ink pb-7"
            style={{ background: "linear-gradient(160deg, #C7D2FE, #4F46E5)" }}
          >
            <span className="text-6xl font-black text-white">ریما</span>
          </div>
          <div>
            <div className="text-[13.5px] font-extrabold tracking-wide text-primary">— درباره من</div>
            <h2 className="mt-3 text-4xl font-black">سلام! من ریما هستم 👋</h2>
            <p className="mt-4 text-[15.5px] leading-9 text-muted">
              ۷ سال است وب‌سایت می‌سازم و در این سال‌ها یاد گرفته‌م فرمول موفقیت یک
              وب‌سایت چیست: طراحی که اعتماد می‌سازد، سرعتی که مشتری را نگه می‌دارد و
              ساختاری که در گوگل دیده شود. اگر دنبال کسی هستید که هم سلیقه دارد هم
              تعهد — جای درستی آمده‌اید.
            </p>
            <Link href="/about" className="btn-hard btn-hard-ghost mt-7">
              بیشتر درباره‌ام بدانید
            </Link>
          </div>
        </section>

        {/* ─── CTA band ─── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-[32px] bg-ink px-8 py-18 text-center sm:px-16">
            <h2 className="text-3xl font-black text-bg sm:text-4xl">
              بیا وب‌سایتت را با هم <em className="text-accent not-italic">بسازیم</em>
            </h2>
            <p className="mt-3.5 text-[15.5px] font-medium text-bg/70">
              قسمت سخت با من؛ شما فقط رویای کسب‌وکارتان را تعریف کنید
            </p>
            <Link href="/contact" className="btn-hard btn-hard-inverse mt-8">
              گفتگو را شروع کنیم
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
