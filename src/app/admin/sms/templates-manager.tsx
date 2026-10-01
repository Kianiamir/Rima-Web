"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createSmsTemplate,
  deleteSmsTemplate,
  toggleSmsTemplate,
  updateSmsTemplate,
} from "@/modules/sms/actions";
import type { SmsTemplateRow } from "@/modules/sms/actions";

function TemplateCard({ template }: { template: SmsTemplateRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [label, setLabel] = useState(template.label);
  const [body, setBody] = useState(template.body);
  const [feedback, setFeedback] = useState<{ ok: boolean; message?: string } | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; message?: string }>) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await fn();
      setFeedback(result);
      if (result.ok) router.refresh();
    });
  };

  return (
    <article
      className={`grid gap-4 rounded-2xl border bg-surface p-5 ${
        template.isEnabled ? "border-line" : "border-dashed border-line opacity-70"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span dir="ltr" className="rounded-lg bg-surface-2 px-2.5 py-1 font-mono text-xs font-bold text-primary-soft">
          {template.key}
        </span>
        {template.isBuiltIn ? (
          <span className="rounded-lg border border-accent/40 px-2 py-0.5 text-[11px] font-bold text-accent">
            سیستمی
          </span>
        ) : null}
        <label className="ms-auto flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted">
          <input
            type="checkbox"
            checked={template.isEnabled}
            onChange={(e) => run(() => toggleSmsTemplate(template.id, e.target.checked))}
            className="size-4 accent-[var(--color-primary)]"
          />
          فعال
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <label className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">عنوان</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-primary/60"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">
            متن پیامک — جای‌بان‌ها با {"{{نام}}"} جایگزین می‌شوند
          </span>
          <textarea
            dir="rtl"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="rounded-xl border border-line bg-bg px-3 py-2 text-sm leading-7 outline-none focus:border-primary/60"
          />
        </label>
      </div>

      {template.description ? (
        <p className="text-xs leading-6 text-muted">{template.description}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => run(() => updateSmsTemplate(template.id, { label, body }))}
          disabled={isPending}
          className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
        >
          ذخیره
        </button>
        {!template.isBuiltIn ? (
          <button
            type="button"
            onClick={() => {
              if (confirm(`قالب «${template.label}» حذف شود؟`)) {
                run(() => deleteSmsTemplate(template.id));
              }
            }}
            disabled={isPending}
            className="rounded-xl border border-line px-5 py-2 text-xs font-bold text-muted transition hover:border-red-500/50 hover:text-red-500 disabled:opacity-50"
          >
            حذف
          </button>
        ) : null}
        {feedback ? (
          <span className={`text-xs font-bold ${feedback.ok ? "text-accent" : "text-red-500"}`}>
            {feedback.message}
          </span>
        ) : null}
      </div>
    </article>
  );
}

const EMPTY_NEW = { key: "", label: "", body: "", description: "" };

export function SmsTemplatesManager({ templates }: { templates: SmsTemplateRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState(EMPTY_NEW);
  const [feedback, setFeedback] = useState<{ ok: boolean; message?: string } | null>(null);

  const create = () => {
    setFeedback(null);
    startTransition(async () => {
      const result = await createSmsTemplate(draft);
      setFeedback(result);
      if (result.ok) {
        setDraft(EMPTY_NEW);
        setShowNew(false);
        router.refresh();
      }
    });
  };

  return (
    <section className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">قالب‌های پیامک</h2>
          <p className="mt-1 text-sm text-muted">
            متن هر پیامک از همین‌جا ویرایش می‌شود؛ جای‌بان‌ها مثل {"{{NAME}}"} هنگام ارسال پر
            می‌شوند.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="rounded-xl border border-line px-5 py-2.5 text-sm font-bold text-muted transition hover:border-primary/50 hover:text-ink"
        >
          {showNew ? "بستن" : "قالب جدید"}
        </button>
      </div>

      {showNew ? (
        <div className="grid gap-4 rounded-2xl border border-primary/40 bg-surface p-5">
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold text-muted">کلید (انگلیسی، مثل ORDER_READY)</span>
              <input
                dir="ltr"
                value={draft.key}
                onChange={(e) => setDraft({ ...draft, key: e.target.value.toUpperCase() })}
                className="rounded-xl border border-line bg-bg px-3 py-2 font-mono text-sm outline-none focus:border-primary/60"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold text-muted">عنوان</span>
              <input
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                className="rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-primary/60"
              />
            </label>
          </div>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-muted">متن پیامک</span>
            <textarea
              rows={3}
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              className="rounded-xl border border-line bg-bg px-3 py-2 text-sm leading-7 outline-none focus:border-primary/60"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={create}
              disabled={isPending}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
            >
              ساخت قالب
            </button>
            {feedback ? (
              <span className={`text-xs font-bold ${feedback.ok ? "text-accent" : "text-red-500"}`}>
                {feedback.message}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4">
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
    </section>
  );
}
