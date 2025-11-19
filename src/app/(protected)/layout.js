import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Billetera Finanzas",
  description: "Panel financiero para controlar ingresos, gastos y presupuestos",
};

export default async function ProtectedLayout({ children }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 lg:flex-row">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col">
        <TopBar user={user} />
        <main className="flex-1 bg-slate-100/60 p-4 sm:p-6 lg:p-8 dark:bg-slate-900/40">{children}</main>
      </div>
    </div>
  );
}
