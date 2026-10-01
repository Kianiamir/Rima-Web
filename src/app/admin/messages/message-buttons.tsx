"use client";

import { useState, useTransition } from "react";
import { markMessageRead, deleteMessage } from "@/modules/messages/actions";

export function MarkReadButton({ id, isRead }: { id: number; isRead: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => markMessageRead(id, !isRead))}
      className="rounded-lg border border-line px-4 py-2 text-xs font-bold text-muted transition hover:border-accent/50 hover:text-accent disabled:opacity-50"
    >
      {isRead ? "علامت‌گذاری به‌عنوان نخوانده" : "علامت‌گذاری به‌عنوان خوانده‌شده"}
    </button>
  );
}

export function DeleteButton({ id }: { id: number }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-line px-4 py-2 text-xs font-bold text-muted transition hover:border-red-500/50 hover:text-red-500"
      >
        حذف
      </button>
    );
  }
  return (
    <span className="flex items-center gap-2 text-xs">
      <span className="text-red-500">مطمئنید؟</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => deleteMessage(id))}
        className="rounded-lg bg-red-500/20 px-4 py-2 font-bold text-red-500 transition hover:bg-red-500/30 disabled:opacity-50"
      >
        بله، حذف کن
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg border border-line px-4 py-2 font-bold text-muted"
      >
        انصراف
      </button>
    </span>
  );
}
