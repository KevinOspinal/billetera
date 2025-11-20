'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNavItem({ item }) {
  const pathname = usePathname();
  if (!item) return null;
  const { href, label } = item;
  const isActive = pathname?.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/40 dark:bg-slate-100 dark:text-slate-900"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
      >
        <span className="inline-flex h-2 w-2 rounded-full bg-slate-300 transition group-hover:bg-slate-500" />
        <span>{label}</span>
      </Link>
    </li>
  );
}
