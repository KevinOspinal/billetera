'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNavItem({ item }) {
  const pathname = usePathname();
  if (!item) return null;
  const { href, label } = item;
  const isActive = pathname?.startsWith(href);

  return (
    <li className="flex-1 lg:flex-none">
      <Link
        href={href}
        className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors lg:justify-start ${
          isActive
            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
            : "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
      >
        <span>{label}</span>
      </Link>
    </li>
  );
}
