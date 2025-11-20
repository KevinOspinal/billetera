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
    <aside className="flex w-full flex-col gap-6 border-b border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60 dark:shadow-slate-900/80 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <SidebarUserInfo name={user?.name ?? "Invitado"} role={user?.email ?? "finanzas@billetera.com"} />
      <SidebarNav items={NAV_ITEMS} />
      <SidebarFooter />
    </aside>
  );
}
