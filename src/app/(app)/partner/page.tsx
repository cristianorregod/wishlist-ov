import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { wishes } from "@/db/schema";
import { getFamily } from "@/lib/family";
import { AppHeader } from "@/components/AppHeader";
import { WishCard } from "@/components/WishCard";
import { CompleteButton } from "@/components/CompleteButton";

export default async function PartnerPage() {
  const session = await auth();
  const family = await getFamily();
  const partner =
    family.dad?.id === session!.user.id ? family.mom : family.dad;

  if (!partner) {
    return <p className="p-5 text-sm text-text-soft">Falta configurar la familia.</p>;
  }

  const partnerWishes = await db
    .select()
    .from(wishes)
    .where(eq(wishes.forWhomId, partner.id));

  return (
    <>
      <AppHeader
        eyebrow="Deseos de"
        title={partner.name}
        initial={partner.name.charAt(0).toUpperCase()}
        tone="accent2"
      />

      <div className="flex flex-col gap-3 px-5">
        {partnerWishes.length === 0 ? (
          <p className="pt-8 text-center text-sm text-text-soft">
            {partner.name} no ha agregado deseos todavía.
          </p>
        ) : (
          partnerWishes.map((wish) => (
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
