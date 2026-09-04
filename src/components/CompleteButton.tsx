"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function CompleteButton({
  wishId,
  completed,
}: {
  wishId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await fetch(`/api/wishes/${wishId}/complete`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !completed }),
          });
          router.refresh();
        });
      }}
      className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border ${
        completed
          ? "border-accent2 bg-accent2 text-white"
          : "border-border text-text-faint"
      }`}
      aria-label={completed ? "Marcar como pendiente" : "Marcar como cumplido"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l4 4 10-10" />
      </svg>
    </button>
  );
}
