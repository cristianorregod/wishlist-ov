import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { wishes } from "@/db/schema";
import { getFamily } from "@/lib/family";
import { canEditWish } from "@/lib/permissions";
import { WishForm } from "@/components/WishForm";
import { BackButton } from "@/components/BackButton";

export default async function EditWishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const family = await getFamily();

  const [wish] = await db.select().from(wishes).where(eq(wishes.id, id)).limit(1);
  if (!wish || !canEditWish(wish, session!.user.id)) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3.5 px-5 pb-3 pt-6">
        <BackButton />
        <h1 className="font-heading text-lg font-bold">Editar deseo</h1>
      </header>
      <WishForm
        daughterName={family.daughter?.name ?? "tu hija"}
        mode="edit"
        wishId={wish.id}
        initialValues={{
          title: wish.title,
          description: wish.description,
          estimatedPrice: wish.estimatedPrice,
          imageUrl: wish.imageUrl,
          priority: wish.priority,
        }}
      />
    </div>
  );
}
