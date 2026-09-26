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
        <h1 className="text-4xl font-black">
          بیا <span className="text-gradient">گفتگو</span> را شروع کنیم
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-8 text-muted">
          قسمت سخت با من؛ شما فقط رویای کسب‌وکارتان را تعریف کنید. معمولاً در
          کمتر از ۲۴ ساعت پاسخ می‌دهم.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px]">
          <ContactForm />

          <aside className="grid content-start gap-4">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-bold">ایمیل</h3>
              <a href="mailto:hello@rimaweb.ir" className="mt-2 block text-sm text-accent" dir="ltr">
                hello@rimaweb.ir
              </a>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-bold">ساعات پاسخگویی</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                شنبه تا پنجشنبه
                <br />
                ۹ صبح تا ۶ عصر
              </p>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-accent/8 p-6">
              <h3 className="font-bold text-accent">مشاوره اولیه</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
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
