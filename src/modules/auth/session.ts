import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import crypto from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers, sessions, type AdminUser } from "@/db/schema";

const COOKIE_NAME = "rimaweb_session";
const SESSION_DAYS = 30;

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function createSession(userId: number): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.insert(sessions).values({ id: sha256(token), userId, expiresAt });
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production",
  });
}

/** Reads the current session admin once per request. */
export const getSessionAdmin = cache(async (): Promise<AdminUser | null> => {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const rows = await db
    .select({ user: adminUsers })
    .from(sessions)
    .innerJoin(adminUsers, eq(adminUsers.id, sessions.userId))
    .where(and(eq(sessions.id, sha256(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0]?.user ?? null;
});

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, sha256(token)));
  }
  jar.delete(COOKIE_NAME);
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/login");
  return admin;
}
