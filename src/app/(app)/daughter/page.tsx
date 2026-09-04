import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { wishes } from "@/db/schema";
import { getFamily } from "@/lib/family";
import { AppHeader } from "@/components/AppHeader";
import { WishCard } from "@/components/WishCard";
import { CompleteButton } from "@/components/CompleteButton";

export default async function DaughterPage() {
  const family = await getFamily();
  const daughter = family.daughter;

  if (!daughter) {
    return <p className="p-5 text-sm text-text-soft">Falta configurar la familia.</p>;
  }

  const daughterWishes = await db
    .select()
    .from(wishes)
    .where(eq(wishes.forWhomId, daughter.id));

  return (
    <>
      <AppHeader
        eyebrow="Deseos de"
        title={daughter.name}
        initial={daughter.name.charAt(0).toUpperCase()}
        tone="lavender"
      />

      <div className="flex flex-col gap-3 px-5">
        {daughterWishes.length === 0 ? (
          <p className="pt-8 text-center text-sm text-text-soft">
            Todavía no hay deseos para {daughter.name}.
          </p>
        ) : (
          daughterWishes.map((wish) => (
            <WishCard
              key={wish.id}
              wish={wish}
              action={
                <CompleteButton
                  wishId={wish.id}
                  completed={wish.status === "completed"}
                />
              }
            />
          ))
        )}
      </div>
    </>
  );
}
