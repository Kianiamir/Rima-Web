"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? "ارسال پیام ناموفق بود");
      }
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد");
      setStatus("error");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-primary/60";

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent/10 p-8 text-center">
        <p className="text-lg font-bold text-accent">پیام‌تان رسید! ✓</p>
        <p className="mt-2 text-sm text-muted">در اسرع وقت با شما تماس می‌گیرم.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-lg border border-line px-5 py-2 text-sm font-semibold text-ink transition hover:border-primary/50"
        >
          ارسال پیام دیگر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold">
            نام و نام خانوادگی <span className="text-primary">*</span>
          </label>
          <input id="name" name="name" required placeholder="نام شما" className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold">
            ایمیل <span className="text-primary">*</span>
          </label>
          <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputCls} dir="ltr" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
          شماره تماس <span className="text-muted text-xs">(اختیاری)</span>
        </label>
        <input id="phone" name="phone" placeholder="۰۹۱۲ ···" className={inputCls} dir="ltr" />
      </div>
      <div>
        <label htmlFor="body" className="mb-2 block text-sm font-semibold">
          توضیح پروژه <span className="text-primary">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={5}
          placeholder="کمی از کسب‌وکار و هدفتان بگویید…"
          className={`${inputCls} resize-y`}
        />
      </div>
      {status === "error" && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-glow rounded-xl bg-primary px-8 py-3.5 font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "در حال ارسال…" : "ارسال پیام"}
      </button>
    </form>
  );
}
