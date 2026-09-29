"use client";

import { useState, useTransition } from "react";
import type { Task } from "@/db/schema";
import { addTask, toggleTask, deleteTask, moveTask } from "@/modules/tasks/actions";

export type TaskRow = Pick<Task, "id" | "title" | "projectId" | "isDone"> & {
  projectTitle: string | null;
};

export type ProjectOption = { id: number; title: string };

const btn =
  "flex h-7 w-7 items-center justify-center rounded-lg border border-line text-xs text-muted transition hover:border-primary/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40";

export function TaskBoard({
  open,
  done,
  projects,
}: {
  open: TaskRow[];
  done: TaskRow[];
  projects: ProjectOption[];
}) {
  return (
    <div className="grid gap-8">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold">
            باید انجام بشه <span className="text-sm font-bold text-muted">({open.length})</span>
          </h2>
        </div>
        <QuickAdd projects={projects} />
        {open.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
            هیچ کاری باز نیست — اولین کار را از فرم بالا اضافه کنید.
          </p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {open.map((t, i) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3"
              >
                <CheckButton id={t.id} isDone={false} />
                {t.projectTitle && (
                  <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold text-primary-soft">
                    {t.projectTitle}
                  </span>
                )}
                <span className="text-sm font-semibold leading-7">{t.title}</span>
                <span className="ms-auto flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="بالا"
                    disabled={i === 0}
                    onClick={() => moveTask(t.id, "up")}
                    className={btn}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="پایین"
                    disabled={i === open.length - 1}
                    onClick={() => moveTask(t.id, "down")}
                    className={btn}
                  >
                    ▼
                  </button>
                  <DeleteTaskButton id={t.id} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-extrabold">
          انجام شده <span className="text-sm font-bold text-muted">({done.length})</span>
        </h2>
        {done.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
            هنوز کاری تمام نشده است.
          </p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {done.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-2xl border border-line/60 bg-bg px-4 py-3 opacity-70"
              >
                <CheckButton id={t.id} isDone />
                {t.projectTitle && (
                  <span className="shrink-0 rounded-full bg-line px-3 py-1 text-[11px] font-bold text-muted">
                    {t.projectTitle}
                  </span>
                )}
                <span className="text-sm text-muted line-through">{t.title}</span>
                <span className="ms-auto shrink-0">
                  <DeleteTaskButton id={t.id} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function CheckButton({ id, isDone }: { id: number; isDone: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label={isDone ? "برگرداندن به کارهای باز" : "علامت‌زدن به‌عنوان انجام‌شده"}
      disabled={pending}
      onClick={() => startTransition(() => toggleTask(id))}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
        isDone
          ? "border-accent/60 bg-accent/20 text-accent"
          : "border-line bg-bg hover:border-accent/60"
      }`}
    >
      {isDone ? "✓" : ""}
    </button>
  );
}

function DeleteTaskButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label="حذف"
      disabled={pending}
      onClick={() => startTransition(() => deleteTask(id))}
      className={`${btn} hover:border-red-500/50 hover:text-red-300`}
    >
      ✕
    </button>
  );
}

function QuickAdd({ projects }: { projects: ProjectOption[] }) {
  const [pending, startTransition] = useTransition();
  const [projectId, setProjectId] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "");
    const pid = String(data.get("projectId") ?? "");
    if (!title.trim()) return;
    startTransition(() => addTask(title, pid ? Number(pid) : null));
    form.reset();
    setProjectId("");
  }

  const inputCls =
    "rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none transition placeholder:text-muted/60 focus:border-primary/60";

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-center gap-2">
      <input
        name="title"
        placeholder="کار جدید… مثلاً: ارسال نسخه دوم طراحی به مشتری"
        className={`${inputCls} min-w-56 flex-1`}
      />
      <select
        name="projectId"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className={`${inputCls} max-w-52`}
      >
        <option value="">— بدون پروژه —</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        افزودن
      </button>
    </form>
  );
}
