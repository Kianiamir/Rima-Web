import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "تماس با من",
  description: "برای سفارش طراحی وب‌سایت و مشاوره اولیه رایگان پیام بدهید",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-[13.5px] font-extrabold tracking-wide text-primary">— تماس</div>
        <h1 className="mt-3 text-4xl font-black">
          بیا <span className="text-primary">گفتگو</span> را شروع کنیم
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-8 font-medium text-muted">
          قسمت سخت با من؛ شما فقط رویای کسب‌وکارتان را تعریف کنید. معمولاً در
          کمتر از ۲۴ ساعت پاسخ می‌دهم.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px]">
          <ContactForm />

          <aside className="grid content-start gap-4">
            <div className="rounded-[18px] border-2 border-ink bg-surface p-6 shadow-[4px_4px_0_var(--color-line)]">
              <h3 className="font-extrabold">ایمیل</h3>
              <a href="mailto:hello@rimaweb.ir" className="mt-2 block text-sm font-bold text-accent-ink" dir="ltr">
                hello@rimaweb.ir
              </a>
            </div>
            <div className="rounded-[18px] border-2 border-ink bg-surface p-6 shadow-[4px_4px_0_var(--color-line)]">
              <h3 className="font-extrabold">ساعات پاسخگویی</h3>
              <p className="mt-2 text-sm leading-7 font-medium text-muted">
                شنبه تا پنجشنبه
                <br />
                ۹ صبح تا ۶ عصر
              </p>
            </div>
            <div className="rounded-[18px] border-2 border-ink bg-accent/15 p-6 shadow-[4px_4px_0_var(--color-accent)]">
              <h3 className="font-extrabold text-accent-ink">مشاوره اولیه</h3>
              <p className="mt-2 text-sm leading-7 font-medium text-muted">
                ۳۰ دقیقه گفتگوی رایگان درباره پروژه‌تان — بدون تعهد.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
