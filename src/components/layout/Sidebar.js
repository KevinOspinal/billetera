import SidebarUserInfo from "./SidebarUserInfo";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transacciones", href: "/transactions" },
  { label: "Nueva transacción", href: "/transactions/new" },
  { label: "Cuentas", href: "/accounts" },
  { label: "Reportes", href: "/reports" },
  { label: "Presupuestos", href: "/budgets" },
];

export default function Sidebar({ user }) {
  return (
    <aside className="flex w-full flex-col gap-8 border-b border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:shadow-none">
      <SidebarUserInfo name={user?.name ?? "Invitado"} role={user?.email ?? "finanzas@billetera.com"} />
      <SidebarNav items={NAV_ITEMS} />
      <SidebarFooter />
    </aside>
  );
}
