import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { wishes } from "@/db/schema";
import { canCompleteWish, canEditWish, redactForOwner } from "@/lib/permissions";
import { BackButton } from "@/components/BackButton";
import { CompleteButton } from "@/components/CompleteButton";
import { LinkifiedText } from "@/components/LinkifiedText";

const priorityStyles = {
  low: "bg-priority-low-bg text-priority-low-ink",
  medium: "bg-priority-medium-bg text-priority-medium-ink",
  high: "bg-priority-high-bg text-priority-high-ink",
} as const;

const priorityLabel = { low: "Baja", medium: "Media", high: "Alta" } as const;

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function WishDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const [row] = await db.select().from(wishes).where(eq(wishes.id, id)).limit(1);
  if (!row) notFound();

  // Never leak completion status to the person the wish is for.
  const wish = redactForOwner(row, userId);
  const completed = wish.status === "completed";

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-3.5 px-5 pb-3 pt-6">
        <BackButton />
        <div className="flex items-center gap-2">
          {canEditWish(wish, userId) ? (
            <Link
              href={`/wishes/${wish.id}/edit`}
              className="rounded-xl border border-border bg-surface px-3.5 py-2 text-[13px] font-semibold"
            >
              Editar
            </Link>
          ) : null}
          {canCompleteWish(wish, userId) ? (
            <CompleteButton wishId={wish.id} completed={completed} />
          ) : null}
        </div>
      </header>

      <div className="flex flex-col gap-4 px-5 pb-28">
        {wish.imageUrl ? (
          <div className="overflow-hidden rounded-2xl bg-accent-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wish.imageUrl}
              alt={wish.title}
              className="max-h-80 w-full object-contain"
            />
          </div>
        ) : null}

        <div>
          <h1 className="font-heading text-2xl font-bold">{wish.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[15px] font-semibold">
              {currency.format(wish.estimatedPrice)}
            </span>
            {completed ? (
              <span className="text-[12px] font-semibold text-accent2-ink">
                Cumplido
              </span>
            ) : (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${priorityStyles[wish.priority]}`}
              >
                {priorityLabel[wish.priority]}
              </span>
            )}
          </div>
        </div>

        {wish.description ? (
          <p className="whitespace-pre-wrap break-words text-[14.5px] leading-relaxed text-text-soft">
            <LinkifiedText text={wish.description} />
          </p>
        ) : null}
      </div>
    </div>
  );
}
