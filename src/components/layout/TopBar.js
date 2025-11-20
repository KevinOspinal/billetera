"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Separator from "@/components/ui/Separator";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "@/components/auth/LogoutButton";

export default function TopBar({ user }) {
  const router = useRouter();

  const handleAddTransaction = (type) => {
    const params = new URLSearchParams({ type });
    router.push(`/transactions/new?${params.toString()}`);
  };

  return (
    <header className="flex flex-col gap-6 border-b border-slate-200/80 bg-white/80 px-4 py-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/70 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Inicio / Dashboard</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
            Hola {user?.name ?? "financiero"}
          </h1>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Lúmina Finance
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Tu panel de decisiones financieras en tiempo real.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-3 dark:border-slate-800/60 dark:bg-slate-900/60">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={() => handleAddTransaction("income")}>
          Añadir ingreso
        </Button>
        <Button size="sm" onClick={() => handleAddTransaction("expense")}>
          Registrar gasto
        </Button>
        <Separator orientation="vertical" className="hidden h-6 sm:inline-flex" />
        <LogoutButton />
        <IconButton label="Abrir menú" icon="⋯" />
      </div>
    </header>
  );
}
