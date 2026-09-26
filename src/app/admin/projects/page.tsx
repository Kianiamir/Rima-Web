import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { ProjectRowActions } from "./row-actions";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const all = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.featured), asc(projects.sortOrder), desc(projects.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">مدیریت نمونه‌کارها</h1>
        <a
          href="/admin/projects/new"
          className="btn-glow rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          + پروژه جدید
        </a>
      </div>

      {all.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
          هنوز پروژه‌ای ثبت نشده — اولین نمونه‌کار را اضافه کنید.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface text-muted">
              <tr className="text-start">
                <th className="p-4 text-start font-semibold">پروژه</th>
                <th className="p-4 text-start font-semibold">دسته</th>
                <th className="p-4 text-start font-semibold">وضعیت</th>
                <th className="p-4 text-start font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-bg">
              {all.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="p-4">
                    <b>{p.title}</b>
                    <span className="mt-1 block text-xs text-muted" dir="ltr">
                      /works/{p.slug}
                    </span>
                  </td>
                  <td className="p-4 text-muted">{p.category}</td>
                  <td className="p-4">
                    {p.published ? (
                      <span className="rounded-full bg-accent/12 px-3 py-1 text-[11px] font-bold text-accent">
                        منتشرشده
                      </span>
                    ) : (
                      <span className="rounded-full bg-line px-3 py-1 text-[11px] font-bold text-muted">
                        پیش‌نویس
                      </span>
                    )}
                    {p.featured && (
                      <span className="ms-1.5 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold text-primary-soft">
                        منتخب
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <ProjectRowActions id={p.id} published={p.published} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
