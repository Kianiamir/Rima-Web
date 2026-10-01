"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/modules/auth/actions";

const initial: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
          ایمیل
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          dir="ltr"
          className="w-full rounded-xl border-2 border-ink/20 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          رمز عبور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          dir="ltr"
          className="w-full rounded-xl border-2 border-ink/20 bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
        />
      </div>
      {state.error && (
        <p className="rounded-xl border-2 border-red-500/50 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-hard btn-hard-primary mt-2 !py-3 disabled:opacity-60"
      >
        {pending ? "در حال ورود…" : "ورود به پنل"}
      </button>
    </form>
  );
}
