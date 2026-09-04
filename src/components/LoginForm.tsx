"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm({
  users,
}: {
  users: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(users[0]?.id ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="flex w-full flex-col gap-9"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const result = await signIn("credentials", {
          userId: selectedId,
          password,
          redirect: false,
        });
        setLoading(false);
        if (result?.error) {
          setError("Contraseña incorrecta");
          return;
        }
        router.push("/mine");
        router.refresh();
      }}
    >
      <div className="flex flex-col items-center gap-3.5">
        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-accent-soft text-accent-ink">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20.5s-7.5-4.6-9.5-9C1.3 8.4 2.4 5 5.8 5c2 0 3.3 1.1 4 2.3.7-1.2 2-2.3 4-2.3 3.4 0 4.5 3.4 3.3 6.5-2 4.4-9.5 9-9.5 9z" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold">Nuestra Lista</h1>
        <p className="text-center text-sm text-text-soft">
          La lista de deseos de la familia
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-semibold text-text-soft">
          ¿Quién eres?
        </span>
        <div className="flex gap-3">
          {users.map((user) => {
            const selected = user.id === selectedId;
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => setSelectedId(user.id)}
                className={`flex flex-1 flex-col items-center gap-2 rounded-[18px] border-2 px-2 py-4 ${
                  selected
                    ? "border-accent bg-accent-soft"
                    : "border-border bg-surface"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full font-heading text-lg font-bold ${
                    selected ? "bg-accent text-white" : "bg-accent2-soft text-accent2-ink"
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold">{user.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-text-soft" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-2xl border border-border bg-surface px-4 py-3.5 text-base outline-none focus:border-accent"
          required
        />
        {error ? <p className="text-sm text-priority-high-ink">{error}</p> : null}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-accent py-4 text-base font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
