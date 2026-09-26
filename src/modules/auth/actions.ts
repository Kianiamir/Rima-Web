"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";
import { z } from "zod";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { createSession, destroySession } from "./session";

const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };
  }

  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, parsed.data.email))
    .limit(1);
  const admin = rows[0];
  // Same generic message for unknown email and wrong password.
  if (!admin) return { error: "ایمیل یا رمز عبور اشتباه است" };

  const ok = await verify(admin.passwordHash, parsed.data.password).catch(() => false);
  if (!ok) return { error: "ایمیل یا رمز عبور اشتباه است" };

  await createSession(admin.id);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
