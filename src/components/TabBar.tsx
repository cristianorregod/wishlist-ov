"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.5s-7.5-4.6-9.5-9C1.3 8.4 2.4 5 5.8 5c2 0 3.3 1.1 4 2.3.7-1.2 2-2.3 4-2.3 3.4 0 4.5 3.4 3.3 6.5-2 4.4-9.5 9-9.5 9z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L12 17l-5.6 3.2 1.4-6.3L3 9.5l6.4-.6L12 3z" />
    </svg>
  );
}

export function TabBar({
  partnerName,
  daughterName,
}: {
  partnerName: string;
  daughterName: string;
}) {
  const pathname = usePathname();

  const tabs = [
    { href: "/mine", label: "Mi lista", Icon: UserIcon },
    { href: "/partner", label: partnerName, Icon: HeartIcon },
    { href: "/daughter", label: daughterName, Icon: StarIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 flex items-center justify-around border-t border-border bg-surface pb-2.5 pt-2">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
              active ? "text-accent-ink" : "font-medium text-text-faint"
            }`}
          >
            <tab.Icon />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
