export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 124 124" className="h-10 w-10" aria-hidden>
        <rect x="6" y="6" width="112" height="112" rx="28" fill="none" stroke="currentColor" strokeWidth="8" />
        <circle cx="36" cy="34" r="6" fill="var(--color-line)" />
        <circle cx="55" cy="34" r="6" fill="var(--color-line)" />
        <circle cx="74" cy="34" r="6" fill="var(--color-primary)" />
        <rect x="34" y="56" width="58" height="10" rx="5" fill="currentColor" />
        <rect x="34" y="78" width="36" height="10" rx="5" fill="var(--color-primary)" />
      </svg>
      <span className="text-xl font-extrabold">ریماوب</span>
    </span>
  );
}
