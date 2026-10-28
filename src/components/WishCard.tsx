import Link from "next/link";
import type { Wish } from "@/db/schema";

const priorityStyles: Record<Wish["priority"], string> = {
  low: "bg-priority-low-bg text-priority-low-ink",
  medium: "bg-priority-medium-bg text-priority-medium-ink",
  high: "bg-priority-high-bg text-priority-high-ink",
};

const priorityLabel: Record<Wish["priority"], string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function WishCard({
  wish,
  action,
}: {
  wish: Wish;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-surface p-3.5">
      <Link
        href={`/wishes/${wish.id}`}
        className="flex min-w-0 flex-1 items-center gap-3.5"
      >
        <div className="h-14 w-14 flex-none overflow-hidden rounded-xl bg-accent-soft">
          {wish.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={wish.imageUrl}
              alt={wish.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold">{wish.title}</p>
          {wish.description ? (
            <p className="truncate text-[12.5px] text-text-soft">
              {wish.description}
            </p>
          ) : null}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[13px] font-semibold">
              {currency.format(wish.estimatedPrice)}
            </span>
            {wish.status === "completed" ? (
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
      </Link>
      {action}
    </div>
  );
}
