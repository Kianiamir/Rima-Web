import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rimaweb.ir"),
  title: {
    default: "ریماوب — طراحی و توسعه وب‌سایت",
    template: "%s | ریماوب",
  },
  description:
    "طراحی و توسعه وب‌سایت‌های مدرن، سریع و سئوشده — از رستوران و آرایشگاه تا فروشگاه آنلاین و سامانه‌های سفارشی.",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "ریماوب",
    title: "ریماوب — طراحی و توسعه وب‌سایت",
    description:
      "وب‌سایتی بسازید که در ذهن می‌ماند — طراحی مدرن، کد تمیز و نتیجه‌محور.",
  },
  keywords: ["طراحی وب سایت", "طراح وب", "فروشگاه آنلاین", "سئو", "ریماوب"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
