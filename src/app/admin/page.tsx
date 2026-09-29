import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { projects, tasks } from "@/db/schema";
import { TaskBoard, type TaskRow } from "./task-board";
import { daysUntil, formatJalali, formatToman } from "@/lib/format";

export const dynamic = "force-dynamic";

function toRows(
  rows: { task: { id: number; title: string; projectId: number | null; isDone: boolean }; projectTitle: string | null }[],
): TaskRow[] {
  return rows.map(({ task, projectTitle }) => ({
    id: task.id,
    title: task.title,
    projectId: task.projectId,
    isDone: task.isDone,
    projectTitle,
  }));
}

export default async function AdminDashboard() {
  const [openRows, doneRows, projectOptions, money, projectInfo] = await Promise.all([
    db
      .select({ task: tasks, projectTitle: projects.title })
      .from(tasks)
      .leftJoin(projects, eq(projects.id, tasks.projectId))
      .where(eq(tasks.isDone, false))
      .orderBy(asc(tasks.sortOrder)),
    db
      .select({ task: tasks, projectTitle: projects.title })
      .from(tasks)
      .leftJoin(projects, eq(projects.id, tasks.projectId))
      .where(eq(tasks.isDone, true))
      .orderBy(desc(tasks.createdAt))
      .limit(20),
    db
      .select({ id: projects.id, title: projects.title })
      .from(projects)
      .orderBy(asc(projects.title)),
    db
      .select({
        total: sql<string>`coalesce(sum(${projects.contractAmount}), 0)`,
        remaining: sql<string>`coalesce(sum(${projects.contractAmount} - ${projects.paidAmount}), 0)`,
      })
      .from(projects),
    db
      .select({
        id: projects.id,
        title: projects.title,
        dueDate: projects.dueDate,
        remaining: sql<string | null>`${projects.contractAmount} - ${projects.paidAmount}`,
      })
      .from(projects)
      .orderBy(asc(projects.title)),
  ]);

  const open = toRows(openRows);
  const done = toRows(doneRows);

  // Active projects = projects that have at least one open task.
  const activeProjectIds = new Set(
    open.map((t) => t.projectId).filter((id): id is number => id != null),
  );

  // "Next step" per project: its first open task (list order).
  const nextByProject = new Map<
    number,
    { title: string; task: string; dueDate: string | null; remaining: string | null }
  >();
  for (const info of projectInfo) {
    nextByProject.set(info.id, {
      title: info.title,
      task: "",
      dueDate: info.dueDate,
      remaining: info.remaining,
    });
  }
  for (const t of open) {
    if (t.projectId == null) continue;
    const entry = nextByProject.get(t.projectId);
    if (entry && !entry.task) entry.task = t.title;
  }
  const nextSteps = [...nextByProject.values()].filter((e) => e.task);

  const totalContracts = Number(money[0]?.total ?? 0);
  const totalRemaining = Number(money[0]?.remaining ?? 0);

  const cards = [
    { label: "پروژه فعال", value: String(activeProjectIds.size) },
    { label: "کار باز", value: String(open.length) },
    { label: "جمع قراردادها (تومان)", value: formatToman(totalContracts) },
    { label: "باقی‌مانده (تومان)", value: formatToman(totalRemaining) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black">داشبورد</h1>

      {/* ── Summary cards ── */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-surface p-6">
            <b className="block text-2xl font-black text-primary-soft">{c.value}</b>
            <span className="mt-1.5 block text-xs font-semibold text-muted">{c.label}</span>
          </div>
        ))}
      </div>

      {/* ── Next step per project ── */}
      {nextSteps.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-extrabold">مرحله بعدی هر پروژه</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nextSteps.map((n) => {
              const days = daysUntil(n.dueDate);
              const dueSoon = days != null && days <= 7;
              return (
                <div
                  key={n.title}
                  className={`rounded-2xl border p-5 ${
                    dueSoon ? "border-accent/50 bg-accent/8" : "border-line bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <b className="text-sm">{n.title}</b>
                    {n.dueDate && (
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
                          dueSoon ? "bg-accent/15 text-accent" : "bg-line text-muted"
                        }`}
                      >
                        تحویل: {formatJalali(n.dueDate)}
                        {days != null && days >= 0 && days <= 7 ? ` (${days} روز)` : ""}
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5 text-sm leading-7 text-muted">→ {n.task}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── The two todo lists ── */}
      <div className="mt-10">
        <TaskBoard open={open} done={done} projects={projectOptions} />
      </div>
    </div>
  );
}
