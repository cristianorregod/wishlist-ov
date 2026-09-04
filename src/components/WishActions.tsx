"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function WishActions({ wishId }: { wishId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-none flex-col gap-2">
      <Link
        href={`/wishes/${wishId}/edit`}
        aria-label="Editar deseo"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-soft"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </Link>
      <button
        type="button"
        disabled={isPending}
        aria-label="Borrar deseo"
        onClick={() => {
          if (!window.confirm("¿Borrar este deseo?")) return;
          startTransition(async () => {
            await fetch(`/api/wishes/${wishId}`, { method: "DELETE" });
            router.refresh();
          });
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-priority-high-ink disabled:opacity-60"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </button>
    </div>
  );
}
