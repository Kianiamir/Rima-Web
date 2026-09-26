import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { messages, projects } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [unread] = await db
    .select({ n: count() })
    .from(messages)
    .where(eq(messages.isRead, false));
  const [totalProjects] = await db.select({ n: count() }).from(projects);
  const recent = await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt))
    .limit(5);

  const cards = [
    { label: "پیام خوانده‌نشده", value: unread.n, href: "/admin/messages" },
    { label: "نمونه‌کار منتشرشده", value: totalProjects.n, href: "/admin/projects" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black">داشبورد</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-line bg-surface p-7 transition hover:border-primary/50"
          >
            <b className="block text-3xl font-black text-primary-soft">{c.value}</b>
            <span className="mt-1.5 block text-sm text-muted">{c.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">آخرین پیام‌ها</h2>
        <Link href="/admin/messages" className="text-sm font-bold text-accent">
          همه پیام‌ها ←
        </Link>
      </div>
      {recent.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {recent.map((m) => (
            <div key={m.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center gap-3">
                <b className="text-sm">{m.name}</b>
                <span className="text-xs text-muted" dir="ltr">
                  {m.email}
                </span>
                {!m.isRead && (
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold text-primary-soft">
                    جدید
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">{m.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
          هنوز پیامی دریافت نشده است.
        </p>
      )}
    </div>
  );
}
