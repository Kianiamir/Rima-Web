"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteProject, toggleProjectPublished } from "@/modules/projects/actions";

export function ProjectRowActions({ id, published }: { id: number; published: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const btn = "rounded-lg border border-line px-3.5 py-2 text-xs font-bold transition";

  return (
    <span className="flex flex-wrap items-center gap-2">
      <Link href={`/admin/projects/${id}`} className={`${btn} text-muted hover:border-primary/50 hover:text-ink`}>
        ویرایش
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => toggleProjectPublished(id, !published))}
        className={`${btn} text-muted hover:border-accent/50 hover:text-accent disabled:opacity-50`}
      >
        {published ? "لغو انتشار" : "انتشار"}
      </button>
      {confirming ? (
        <span className="flex items-center gap-1.5 text-xs">
          <span className="text-red-300">حذف؟</span>
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => deleteProject(id))}
            className="rounded-lg bg-red-500/20 px-3 py-2 font-bold text-red-300 hover:bg-red-500/30 disabled:opacity-50"
          >
            بله
          </button>
          <button type="button" onClick={() => setConfirming(false)} className={`${btn} text-muted`}>
            خیر
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className={`${btn} text-muted hover:border-red-500/50 hover:text-red-300`}
        >
          حذف
        </button>
      )}
    </span>
  );
}
