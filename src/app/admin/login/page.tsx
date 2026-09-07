import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Giriş" };

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-line bg-paper p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.65)]">
        <div className="mx-auto flex h-24 w-24 flex-col items-center justify-center rounded-full border border-olive/45">
          <p className="font-[family-name:var(--font-script)] text-[2rem] leading-none">
            By Balet
          </p>
          <p className="mt-1 text-[8px] tracking-[0.22em] text-olive uppercase">
            Cafe & Bistro
          </p>
        </div>
        <p className="mt-5 text-center text-sm text-muted">
          Menüyü düzenlemek için giriş yapın.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
