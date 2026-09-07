"use client";

import { useState } from "react";

export function DeleteButton({
  action,
  id,
  label = "Sil",
  confirmText = "Bu öğeyi silmek istediğinize emin misiniz?",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  confirmText?: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (formData) => {
        if (!window.confirm(confirmText)) return;
        setPending(true);
        await action(formData);
        setPending(false);
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="text-sm text-rose hover:underline disabled:opacity-50"
      >
        {pending ? "Siliniyor…" : label}
      </button>
    </form>
  );
}
