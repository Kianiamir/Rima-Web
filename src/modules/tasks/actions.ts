"use server";

import { revalidatePath } from "next/cache";
import { and, asc, eq, gt, lt, desc, isNull } from "drizzle-orm";
import { db } from "@/db";
import { tasks, type Task } from "@/db/schema";
import { requireAdmin } from "@/modules/auth/session";

function refresh() {
  revalidatePath("/admin");
}

export async function addTask(title: string, projectId: number | null): Promise<void> {
  await requireAdmin();
  const clean = title.trim();
  if (!clean) return;

  // Display order is ASC by sortOrder — new task takes the top spot.
  const [minRow] = await db
    .select({ min: tasks.sortOrder })
    .from(tasks)
    .orderBy(asc(tasks.sortOrder))
    .limit(1);
  const next = (minRow?.min ?? 0) - 1;

  await db.insert(tasks).values({
    title: clean.slice(0, 300),
    projectId: projectId ?? null,
    sortOrder: next,
  });
  refresh();
}

export async function toggleTask(id: number): Promise<void> {
  await requireAdmin();
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  if (!task) return;
  await db.update(tasks).set({ isDone: !task.isDone }).where(eq(tasks.id, id));
  refresh();
}

export async function deleteTask(id: number): Promise<void> {
  await requireAdmin();
  await db.delete(tasks).where(eq(tasks.id, id));
  refresh();
}

/** Tasks sharing the same list scope: same done-state and same project (or none). */
function scopeOf(task: Task) {
  return task.projectId == null
    ? and(eq(tasks.isDone, task.isDone), isNull(tasks.projectId))
    : and(eq(tasks.isDone, task.isDone), eq(tasks.projectId, task.projectId));
}

/** Moves a task one position up/down within its own scope. */
export async function moveTask(id: number, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  if (!task) return;

  const [neighbor] =
    direction === "up"
      ? await db
          .select()
          .from(tasks)
          .where(and(scopeOf(task), lt(tasks.sortOrder, task.sortOrder)))
          .orderBy(desc(tasks.sortOrder))
          .limit(1)
      : await db
          .select()
          .from(tasks)
          .where(and(scopeOf(task), gt(tasks.sortOrder, task.sortOrder)))
          .orderBy(asc(tasks.sortOrder))
          .limit(1);
  if (!neighbor) return;

  await db.update(tasks).set({ sortOrder: neighbor.sortOrder }).where(eq(tasks.id, task.id));
  await db.update(tasks).set({ sortOrder: task.sortOrder }).where(eq(tasks.id, neighbor.id));
  refresh();
}
