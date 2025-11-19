import SidebarNavItem from "./SidebarNavItem";

export default function SidebarNav({ items = [] }) {
  return (
    <nav>
      <ul className="flex flex-wrap gap-2 lg:flex-col">
        {items.map((item) => (
          <SidebarNavItem key={item.href} item={item} />
        ))}
      </ul>
    </nav>
  );
}
