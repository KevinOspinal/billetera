"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function DashboardActions() {
  const router = useRouter();

  const handleAddTransaction = (type) => {
    const params = new URLSearchParams({ type });
    router.push(`/transactions/new?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur dark:bg-slate-900/40">
      <Button variant="secondary" onClick={() => handleAddTransaction("expense")}>
        Añadir gasto
      </Button>
      <Button variant="ghost" onClick={() => handleAddTransaction("income")}>
        Añadir ingreso
      </Button>
    </div>
  );
}
