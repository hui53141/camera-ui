"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  label: string;
  href: string;
}

export function TabNav({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-[var(--border)] bg-white -mx-6 -mt-6 px-6">
      <nav className="flex gap-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                isActive
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-transparent text-[var(--muted)] hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
