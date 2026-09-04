export function AppHeader({
  eyebrow,
  title,
  initial,
  tone = "accent",
}: {
  eyebrow: string;
  title: string;
  initial: string;
  tone?: "accent" | "accent2" | "lavender";
}) {
  const toneClasses = {
    accent: "bg-accent text-white",
    accent2: "bg-accent2-soft text-accent2-ink",
    lavender: "bg-lavender-soft text-lavender-ink",
  }[tone];

  return (
    <header className="flex items-center justify-between px-5 pb-4 pt-7">
      <div>
        <p className="mb-0.5 text-[13px] text-text-soft">{eyebrow}</p>
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
      </div>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full font-heading text-[15px] font-bold ${toneClasses}`}
      >
        {initial}
      </div>
    </header>
  );
}
