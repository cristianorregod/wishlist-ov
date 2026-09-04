import { getFamily } from "@/lib/family";
import { WishForm } from "@/components/WishForm";
import { BackButton } from "@/components/BackButton";

export default async function NewWishPage() {
  const family = await getFamily();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3.5 px-5 pb-3 pt-6">
        <BackButton />
        <h1 className="font-heading text-lg font-bold">Nuevo deseo</h1>
      </header>
      <WishForm daughterName={family.daughter?.name ?? "tu hija"} />
    </div>
  );
}
