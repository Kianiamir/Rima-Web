"use server";

import { revalidatePath } from "next/cache";
import { eq, not } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { requireAdmin } from "@/modules/auth/session";

export async function markMessageRead(id: number, read: boolean): Promise<void> {
  await requireAdmin();
  await db.update(messages).set({ isRead: read }).where(eq(messages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: number): Promise<void> {
  await requireAdmin();
  await db.delete(messages).where(eq(messages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function toggleMessageRead(id: number): Promise<void> {
  await requireAdmin();
  await db
    .update(messages)
    .set({ isRead: not(messages.isRead) })
    .where(eq(messages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
