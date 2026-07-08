"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

interface PasswordGateProps {
  children: ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const password = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD;
  const [input, setInput] = useState("");
  const [passed, setPassed] = useState(false);
  const enabled = useMemo(() => Boolean(password), [password]);

  if (!enabled || passed) {
    return <>{children}</>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dashboard-page px-6">
      <form
        className="w-full max-w-sm rounded-lg border border-dashboard-line bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          setPassed(input === password);
        }}
      >
        <h1 className="text-xl font-semibold text-dashboard-text">访问看板</h1>
        <p className="mt-2 text-sm text-dashboard-sub">请输入访问密码。</p>
        <input
          type="password"
          className="mt-5 w-full rounded-md border border-dashboard-line px-3 py-2 text-sm outline-none focus:border-dashboard-orange"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoFocus
        />
        <button className="mt-4 w-full rounded-md bg-dashboard-orange px-4 py-2 text-sm font-semibold text-white">
          进入
        </button>
      </form>
    </main>
  );
}
