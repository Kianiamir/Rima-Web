"use client";

import { useState, useTransition } from "react";
import { getSmsCredit, sendTestSms, updateSmsSettings } from "@/modules/sms/actions";
import type { SmsSettingsView, SmsTemplateRow } from "@/modules/sms/actions";
import { faNum } from "@/lib/format";

function feedbackStyle(ok: boolean) {
  return ok ? "text-accent" : "text-red-400";
}

export function SmsSettingsForm({
  initial,
  templates,
}: {
  initial: SmsSettingsView;
  templates: SmsTemplateRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const [apiKey, setApiKey] = useState("");
  const [senderNumber, setSenderNumber] = useState(initial.senderNumber);
  const [notifyPhone, setNotifyPhone] = useState(
    initial.notifyPhone && !initial.notifyPhone.startsWith("0")
      ? `0${initial.notifyPhone}`
      : initial.notifyPhone,
  );
  const [sandbox, setSandbox] = useState(initial.sandbox);
  const [saveFeedback, setSaveFeedback] = useState<{ ok: boolean; message?: string } | null>(null);

  const [credit, setCredit] = useState<number | null>(null);
  const [creditError, setCreditError] = useState<string | null>(null);
  const [isCheckingCredit, startCreditCheck] = useTransition();

  const [testPhone, setTestPhone] = useState("");
  const [testKey, setTestKey] = useState(templates[0]?.key ?? "");
  const [testFeedback, setTestFeedback] = useState<{ ok: boolean; message?: string } | null>(null);
  const [isTestSending, startTestSend] = useTransition();

  const save = () => {
    startTransition(async () => {
      const result = await updateSmsSettings({
        apiKey,
        senderNumber,
        notifyPhone,
        sandbox,
      });
      setSaveFeedback(result);
      if (result.ok) setApiKey("");
    });
  };

  const checkCredit = () => {
    setCreditError(null);
    startCreditCheck(async () => {
      const result = await getSmsCredit();
      if (result.ok) {
        setCredit(result.credit);
      } else {
        setCredit(null);
        setCreditError(result.error ?? "استعلام اعتبار ناموفق بود");
      }
    });
  };

  const runTestSend = () => {
    setTestFeedback(null);
    startTestSend(async () => {
      const result = await sendTestSms({ phone: testPhone, templateKey: testKey });
      setTestFeedback({ ok: result.ok, message: result.message });
    });
  };

  return (
    <section className="grid gap-6 rounded-3xl border border-line bg-surface p-7">
      <div>
        <h2 className="text-lg font-extrabold">اتصال سامانهٔ پیامکی</h2>
        <p className="mt-1 text-sm text-muted">
          کلید API و شمارهٔ خط سامانه (sms.ir). اگر کلید اینجا خالی بماند، مقدار متغیر
          محیطی <span dir="ltr" className="font-mono text-xs">SMSIR_API_KEY</span> سرور استفاده
          می‌شود.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="flex items-center gap-2 text-sm font-bold">
            کلید API
            {initial.hasApiKey ? (
              <span className="rounded-lg border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-muted">
                {initial.apiKeyFromEnv
                  ? "از سرور (env)"
                  : `تنظیم‌شده · ‑‑‑‑${initial.apiKeyLast4 ?? ""}`}
              </span>
            ) : (
              <span className="rounded-lg border border-dashed border-line px-2 py-0.5 text-[11px] font-semibold text-muted">
                تنظیم‌نشده
              </span>
            )}
          </span>
          <input
            type="password"
            dir="ltr"
            autoComplete="off"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={initial.hasApiKey ? "برای تغییر، کلید جدید را وارد کنید" : "کلید API سامانه"}
            className="rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary/60"
          />
          <span className="text-xs text-muted">
            {initial.hasApiKey ? "خالی بگذارید تا کلید فعلی حفظ شود." : "بدون کلید، ارسال انجام نمی‌شود."}
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold">شمارهٔ خط سامانه</span>
          <input
            dir="ltr"
            value={senderNumber}
            onChange={(e) => setSenderNumber(e.target.value)}
            placeholder="مثلاً 30001234567890"
            className="rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary/60"
          />
          <span className="text-xs text-muted">
            خط ارسال از پنل sms.ir — همهٔ پیامک‌های سایت با این شماره می‌روند.
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold">موبایل مدیر (گیرندهٔ اطلاع‌رسانی)</span>
          <input
            dir="ltr"
            value={notifyPhone}
            onChange={(e) => setNotifyPhone(e.target.value)}
            placeholder="مثلاً 09121234567"
            className="rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary/60"
          />
          <span className="text-xs text-muted">
            وقتی پیام جدیدی از فرم تماس برسد، این شماره پیامک می‌گیرد.
          </span>
        </label>

        <div className="grid content-start gap-2">
          <span className="text-sm font-bold">حالت تست</span>
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={sandbox}
              onChange={(e) => setSandbox(e.target.checked)}
              className="size-4 accent-[var(--color-primary)]"
            />
            ارسال‌ها فقط در گزارش ثبت شوند (به شمارهٔ واقعی نمی‌روند)
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
        >
          {isPending ? "در حال ذخیره…" : "ذخیره تنظیمات"}
        </button>
        {saveFeedback ? (
          <span className={`text-sm font-semibold ${feedbackStyle(saveFeedback.ok)}`}>
            {saveFeedback.message}
          </span>
        ) : null}

        <span className="mx-1 h-6 w-px bg-line" />

        <button
          type="button"
          onClick={checkCredit}
          disabled={isCheckingCredit}
          className="rounded-xl border border-line px-5 py-2.5 text-sm font-bold text-muted transition hover:border-primary/50 hover:text-ink disabled:opacity-50"
        >
          {isCheckingCredit ? "…" : "استعلام اعتبار"}
        </button>
        {credit !== null ? (
          <span className="text-sm font-bold text-accent">
            اعتبار باقی‌مانده: {faNum(credit)} پیامک
          </span>
        ) : null}
        {creditError ? <span className="text-xs text-red-400">{creditError}</span> : null}
      </div>

      <div className="rounded-2xl border border-dashed border-line p-5">
        <h3 className="text-sm font-extrabold">ارسال آزمایشی</h3>
        <p className="mt-1 text-xs text-muted">
          برای اطمینان از اتصال و متن قالب، یک پیامک آزمایشی بفرستید.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            dir="ltr"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="09121234567"
            className="w-44 rounded-xl border border-line bg-bg px-4 py-2 text-sm outline-none focus:border-primary/60"
          />
          <select
            dir="ltr"
            value={testKey}
            onChange={(e) => setTestKey(e.target.value)}
            className="rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-primary/60"
          >
            {templates.map((t) => (
              <option key={t.key} value={t.key}>
                {t.key}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={runTestSend}
            disabled={isTestSending || templates.length === 0}
            className="rounded-xl border border-primary/50 bg-primary/10 px-5 py-2 text-sm font-bold text-primary-soft transition hover:bg-primary/20 disabled:opacity-50"
          >
            {isTestSending ? "…" : "ارسال پیامک آزمایشی"}
          </button>
          {testFeedback ? (
            <span className={`text-sm font-semibold ${feedbackStyle(testFeedback.ok)}`}>
              {testFeedback.message}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
