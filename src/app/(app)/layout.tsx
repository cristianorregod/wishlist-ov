import { getFamily } from "@/lib/family";
import { auth } from "@/lib/auth";
import { TabBar } from "@/components/TabBar";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const family = await getFamily();

  const partner =
    family.dad?.id === session?.user?.id ? family.mom : family.dad;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col pb-24">
      {children}
      <TabBar
        partnerName={partner?.name ?? "Pareja"}
        daughterName={family.daughter?.name ?? "Hija"}
      />
    </div>
  );
}
