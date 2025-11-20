"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import ExpensesTabs from "./ExpensesTabs";
import ExpensesByCategoryChart from "./ExpensesByCategoryChart";

const TAB_LABELS = {
  month: "Movimientos del mes completo",
  week: "Últimos 7 días",
  today: "Gastos del día",
};

export default function ExpensesOverviewCard({ categories = {}, currency }) {
  const [activeTab, setActiveTab] = useState("month");
  const currentCategories = useMemo(() => categories?.[activeTab] ?? [], [categories, activeTab]);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">Resumen de gastos</h3>
          <p className="text-sm text-slate-400">{TAB_LABELS[activeTab]}</p>
        </div>
        <ExpensesTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>
      <ExpensesByCategoryChart categories={currentCategories} currency={currency} />
    </Card>
  );
}
