"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "rimaweb-theme";

/**
 * Theme toggle — flips the `light` class on <html> and persists the
 * choice. First visit follows the OS preference (see the inline script
 * in the root layout that runs before paint).
 */
export function ThemeToggle() {
  const [light, setLight] = useState<boolean | null>(null);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !(light ?? false);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
    } catch {
      /* private mode — theme just won't persist */
    }
    setLight(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "تغییر به تم تیره" : "تغییر به تم روشن"}
      title={light ? "تم تیره" : "تم روشن"}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-primary/50 hover:text-primary"
    >
      {light ? (
        // Moon — clicking returns to the dark theme
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-4.5 w-4.5">
          <path
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
          />
        </svg>
      ) : (
        // Sun — clicking switches to the light theme
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-4.5 w-4.5">
          <circle cx="12" cy="12" r="4" stroke="currentColor" />
          <path
            d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            strokeLinecap="round"
            stroke="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
