import { desc } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { MarkReadButton, DeleteButton } from "./message-buttons";

export const dynamic = "force-dynamic";

function faDate(d: Date): string {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(d);
}

export default async function AdminMessagesPage() {
  const all = await db.select().from(messages).orderBy(desc(messages.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">پیام‌های تماس</h1>
        <span className="text-sm text-muted">{all.length} پیام</span>
      </div>

      {all.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
          هنوز پیامی دریافت نشده است.
        </p>
      ) : (
        <div className="mt-8 grid gap-4">
          {all.map((m) => (
            <article
              key={m.id}
              className={`rounded-2xl border bg-surface p-6 ${
                m.isRead ? "border-line" : "border-primary/45"
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <b>{m.name}</b>
                <span className="text-sm text-muted" dir="ltr">
                  {m.email}
                </span>
                {m.phone && (
                  <span className="text-sm text-muted" dir="ltr">
                    {m.phone}
                  </span>
                )}
                <span className="ms-auto text-xs text-muted">{faDate(m.createdAt)}</span>
              </div>
              <p className="mt-4 text-sm leading-8 whitespace-pre-line text-ink/90">{m.body}</p>
              <div className="mt-5 flex items-center gap-2">
                <MarkReadButton id={m.id} isRead={m.isRead} />
                <DeleteButton id={m.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
