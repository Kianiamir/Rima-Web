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

/** Runs before paint: stored theme wins, otherwise follow the OS preference. */
const themeInitScript = `(function(){try{var s=localStorage.getItem("rimaweb-theme");var l=s?s==="light":window.matchMedia("(prefers-color-scheme: light)").matches;document.documentElement.classList.toggle("light",l)}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      <body className="antialiased">{children}</body>
    </html>
  );
}
