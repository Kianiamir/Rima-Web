"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "rimaweb-theme";

/**
 * Theme toggle — the light «نیلی» theme is the default; this flips the
 * `dark` class on <html> and persists the choice. First visit follows
 * the OS preference (see the inline script in the root layout that runs
 * before paint).
 */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !(dark ?? false);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* private mode — theme just won't persist */
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "تغییر به تم روشن" : "تغییر به تم تیره"}
      title={dark ? "تم روشن" : "تم تیره"}
      className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink/15 bg-surface text-muted transition hover:border-ink/40 hover:text-ink"
    >
      {dark ? (
        // Sun — clicking returns to the light theme
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-4.5 w-4.5">
          <circle cx="12" cy="12" r="4" stroke="currentColor" />
          <path
            d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            strokeLinecap="round"
            stroke="currentColor"
          />
        </svg>
      ) : (
        // Moon — clicking switches to the dark theme
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-4.5 w-4.5">
          <path
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
