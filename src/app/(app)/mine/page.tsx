import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { wishes } from "@/db/schema";
import { AppHeader } from "@/components/AppHeader";
import { WishCard } from "@/components/WishCard";
import { WishActions } from "@/components/WishActions";
import { redactForOwner } from "@/lib/permissions";

export default async function MinePage() {
  const session = await auth();
  const userId = session!.user.id;

  const rows = await db.select().from(wishes).where(eq(wishes.forWhomId, userId));
  // Defense in depth: even on the owner's own list, never render the
  // completion status — that's the surprise the app exists to protect.
  const myWishes = rows.map((wish) => redactForOwner(wish, userId));

  return (
    <>
      <AppHeader
        eyebrow={`Hola, ${session!.user.name ?? ""}`}
        title="Mi lista"
        initial={(session!.user.name ?? "?").charAt(0).toUpperCase()}
        tone="accent"
      />

      <div className="flex flex-col gap-3 px-5">
        {myWishes.length === 0 ? (
          <p className="pt-8 text-center text-sm text-text-soft">
            Aún no has agregado ningún deseo.
          </p>
        ) : (
          myWishes.map((wish) => (
            <WishCard
              key={wish.id}
              wish={wish}
              action={<WishActions wishId={wish.id} />}
            />
          ))
        )}
      </div>

      <Link
        href="/wishes/new?for=mine"
        className="fixed bottom-24 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg"
        aria-label="Agregar deseo"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Link>
    </>
  );
}
