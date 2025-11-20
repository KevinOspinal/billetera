import SidebarNavItem from "./SidebarNavItem";

export default function SidebarNav({ items = [] }) {
  return (
    <nav className="rounded-3xl border border-slate-200/60 bg-white/90 p-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <SidebarNavItem key={item.href} item={item} />
        ))}
      </ul>
    </nav>
  );
}
