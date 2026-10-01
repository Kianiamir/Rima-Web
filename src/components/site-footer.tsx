export function SiteFooter() {
  return (
    <footer className="border-t-2 border-dashed border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm font-semibold text-muted sm:flex-row">
        <span>© ۱۴۰۵ ریماوب — با ❤️ ساخته شده</span>
        <a href="mailto:hello@rimaweb.ir" className="transition-colors hover:text-ink" dir="ltr">
          hello@rimaweb.ir
        </a>
      </div>
    </footer>
  );
}
