"use client";

import { useActionState } from "react";
import type { Project } from "@/db/schema";
import {
  createProject,
  updateProject,
  type ProjectFormState,
} from "@/modules/projects/actions";
import { formatJalali } from "@/lib/format";

const initial: ProjectFormState = {};

const GRADIENTS = [
  ["بنفش کهکشانی", "radial-gradient(300px 200px at 20% 0%, rgba(124,108,255,.8), #1B1F33)"],
  ["فیروزه‌ای", "radial-gradient(300px 200px at 80% 10%, rgba(45,212,191,.55), #14232B)"],
  ["بنفش روشن", "radial-gradient(300px 200px at 50% 100%, rgba(167,139,250,.6), #1B1B2E)"],
  ["آبی", "radial-gradient(300px 200px at 30% 20%, rgba(79,70,229,.8), #14162B)"],
] as const;

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-primary/60";

const sectionTitle = "mb-3 border-b border-line pb-2 text-sm font-extrabold text-primary-soft";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-2">
      <legend className={sectionTitle}>{title}</legend>
      {children}
    </fieldset>
  );
}

export function ProjectForm({ project }: { project?: Project }) {
  const isEdit = Boolean(project);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateProject : createProject,
    initial,
  );

  return (
    <form action={formAction} className="grid max-w-3xl gap-5">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="existingCover" value={project?.coverImage ?? ""} />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">عنوان پروژه *</span>
          <input name="title" required defaultValue={project?.title} className={inputCls} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">
            نامک (آدرس) — خالی بگذارید تا خودکار ساخته شود
          </span>
          <input name="slug" defaultValue={project?.slug} dir="ltr" placeholder="luxury-barber" className={inputCls} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">دسته‌بندی *</span>
          <input
            name="category"
            required
            defaultValue={project?.category}
            placeholder="فروشگاه، رزرو آنلاین، …"
            className={inputCls}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">سال</span>
          <input name="year" defaultValue={project?.year} placeholder="۱۴۰۴" className={inputCls} />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">خلاصه (یک خط) *</span>
        <input name="summary" required defaultValue={project?.summary} className={inputCls} />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">توضیحات کامل</span>
        <textarea name="description" rows={6} defaultValue={project?.description} className={`${inputCls} resize-y`} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">لینک وب‌سایت</span>
          <input name="link" defaultValue={project?.link} dir="ltr" placeholder="https://…" className={inputCls} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">برچسب‌ها (با کاما جدا کنید)</span>
          <input name="tags" defaultValue={project?.tags} placeholder="Next.js, طراحی رستوران" className={inputCls} />
        </label>
      </div>

      <Section title="مشخصات مشتری (خصوصی)">
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">نام مشتری</span>
            <input name="clientName" defaultValue={project?.clientName} className={inputCls} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold">تلفن</span>
            <input name="clientPhone" defaultValue={project?.clientPhone} dir="ltr" className={inputCls} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold">ایمیل</span>
            <input name="clientEmail" defaultValue={project?.clientEmail} dir="ltr" className={inputCls} />
          </label>
        </div>
      </Section>

      <Section title="اطلاعات مالی (خصوصی — تومان)">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">مبلغ قرارداد</span>
            <input
              name="contractAmount"
              defaultValue={project?.contractAmount ?? ""}
              dir="ltr"
              inputMode="numeric"
              placeholder="45,000,000"
              className={inputCls}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold">پرداخت‌شده</span>
            <input
              name="paidAmount"
              defaultValue={project?.paidAmount ? project.paidAmount : ""}
              dir="ltr"
              inputMode="numeric"
              placeholder="15,000,000"
              className={inputCls}
            />
          </label>
        </div>
      </Section>

      <Section title="زمان‌بندی (خصوصی)">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">تاریخ شروع (شمسی)</span>
            <input
              name="startDate"
              defaultValue={project?.startDate ? formatJalali(project.startDate) : ""}
              dir="ltr"
              placeholder="1404/07/15"
              className={inputCls}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold">ددلاین تحویل (شمسی)</span>
            <input
              name="dueDate"
              defaultValue={project?.dueDate ? formatJalali(project.dueDate) : ""}
              dir="ltr"
              placeholder="1404/08/01"
              className={inputCls}
            />
          </label>
        </div>
      </Section>

      <Section title="یادداشت داخلی (خصوصی)">
        <label className="grid gap-2">
          <textarea
            name="internalNote"
            rows={4}
            defaultValue={project?.internalNote}
            placeholder="نکات جلسات، خواسته‌های مشتری، وضعیت پرداخت‌ها…"
            className={`${inputCls} resize-y`}
          />
        </label>
      </Section>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">تصویر کاور</span>
        <input
          type="file"
          name="cover"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="file:mr-3 file:rounded-lg file:border-0 file:bg-primary/20 file:px-4 file:py-2 file:text-sm file:font-bold file:text-primary-soft w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted"
        />
        {project?.coverImage && (
          <span className="text-xs text-muted">تصویر فعلی: {project.coverImage}</span>
        )}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">
          کاور پیش‌فرض (وقتی تصویری آپلود نشود)
        </span>
        <select name="coverGradient" defaultValue={project?.coverGradient} className={inputCls}>
          {GRADIENTS.map(([label, value]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5 text-sm font-semibold">
          <input
            type="checkbox"
            name="published"
            defaultChecked={project?.published ?? true}
            className="h-4.5 w-4.5 accent-[#7c6cff]"
          />
          منتشرشده باشد
        </label>
        <label className="flex items-center gap-2.5 text-sm font-semibold">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured ?? false}
            className="h-4.5 w-4.5 accent-[#7c6cff]"
          />
          نمونه‌کار منتخب (صفحه اصلی)
        </label>
        <label className="flex items-center gap-2.5 text-sm font-semibold">
          ترتیب نمایش
          <input
            type="number"
            name="sortOrder"
            defaultValue={project?.sortOrder ?? 0}
            className="w-20 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm"
          />
        </label>
      </div>

      {state.error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-glow rounded-xl bg-primary px-8 py-3 font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "در حال ذخیره…" : isEdit ? "ذخیره تغییرات" : "افزودن پروژه"}
        </button>
        <a href="/admin/projects" className="text-sm font-bold text-muted transition hover:text-ink">
          انصراف
        </a>
      </div>
    </form>
  );
}
