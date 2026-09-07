"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Kullanıcı adı</span>
        <input
          name="username"
          autoComplete="username"
          required
          className="w-full rounded-2xl border border-line bg-cream/40 px-4 py-3 outline-none transition focus:border-olive focus:bg-paper"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Şifre</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-line bg-cream/40 px-4 py-3 outline-none transition focus:border-olive focus:bg-paper"
        />
      </label>
      {state?.error ? (
        <p className="text-sm text-rose">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-olive px-4 py-3 font-medium text-paper transition hover:bg-olive-dark disabled:opacity-60"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
