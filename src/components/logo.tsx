/**
 * لوگوی ریماوب — مونوگرام شبکه‌ای «ر» (انتخاب کاربر، طرح B).
 * مسیر منحنی حرف «ر» با گره‌های اتصال در دو سر؛ گرهٔ کهربایی از توکن
 * accent پیروی می‌کند تا در هر دو تم درست بنشیند.
 */
export function Logo({ className = "", withWord = true }: { className?: string; withWord?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="335.5 5 197 197" className="h-10 w-10" aria-hidden>
        {/* آنتن اتصال به شبکه */}
        <line x1="470" y1="52" x2="516" y2="26" stroke="var(--color-muted)" strokeWidth="6" strokeLinecap="round" opacity=".55" />
        <circle cx="521" cy="23" r="8" fill="var(--color-muted)" opacity=".55" />
        {/* مسیر «ر» */}
        <path
          d="M 470 55 C 482 92 480 122 450 148 C 422 171 382 175 360 160"
          fill="none"
          stroke="currentColor"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <circle cx="470" cy="55" r="15" fill="var(--color-accent)" stroke="var(--color-bg)" strokeWidth="5" />
        <circle cx="360" cy="160" r="15" fill="currentColor" stroke="var(--color-bg)" strokeWidth="5" />
      </svg>
      {withWord && <span className="text-xl font-extrabold">ریماوب</span>}
    </span>
  );
}
