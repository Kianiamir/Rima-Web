import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectCard } from "@/components/project-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "نمونه‌کارها",
  description: "گالری پروژه‌های طراحی و توسعه وب — از فروشگاه آنلاین تا سامانه‌های سفارشی",
};

export default async function WorksPage() {
  const all = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(desc(projects.featured), desc(projects.sortOrder), desc(projects.createdAt));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-[13.5px] font-extrabold tracking-wide text-primary">— نمونه‌کارها</div>
        <h1 className="mt-3 text-4xl font-black">
          کارهایی که بهشان <span className="text-primary">افتخار</span> می‌کنم
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-8 text-muted">
          مجموعه‌ای از پروژه‌هایی که با عشق و وسواس ساخته‌ام — روی هرکدام کلیک کنید
          تا جزئیاتش را ببینید.
        </p>
        {all.length > 0 ? (
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-2xl border-2 border-dashed border-line p-12 text-center text-sm font-semibold text-muted">
            هنوز نمونه‌کاری منتشر نشده — به‌زودی پر می‌شود!
          </p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
