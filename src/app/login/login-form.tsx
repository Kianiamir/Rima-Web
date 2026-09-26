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
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary/60"
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
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary/60"
        />
      </div>
      {state.error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-glow mt-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "در حال ورود…" : "ورود به پنل"}
      </button>
    </form>
  );
}
