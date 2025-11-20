"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import BudgetsHeader from "./BudgetsHeader";
import BudgetsList from "./BudgetsList";
import BudgetForm from "./BudgetForm";
import BudgetsChart from "./BudgetsChart";
import { formatCurrency } from "@/lib/format";

function defaultPeriodRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

export default function BudgetsClient({
  userId,
  budgets: initialBudgets = [],
  totals,
  categories = [],
  currency,
  availableBalance = 0,
}) {
  const router = useRouter();
  const [budgets, setBudgets] = useState(initialBudgets);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, startTransition] = useTransition();
  const [formError, setFormError] = useState("");

  const [formValues, setFormValues] = useState(() => {
    const range = defaultPeriodRange();
    return {
      categoryId: categories[0]?.id ?? "",
      limitAmount: "",
      period: "monthly",
      periodStart: range.start,
      periodEnd: range.end,
    };
  });

  const expenseCategories = categories.map((category) => ({
    label: category.name,
    value: String(category.id),
  }));

  const chartData = useMemo(
    () =>
      budgets.map((budget) => ({
        id: budget.id,
        label: budget.categoryName,
        limit: budget.limitAmount,
        spent: budget.spentAmount,
        color: budget.color,
      })),
    [budgets]
  );

  const summaryTotals = useMemo(() => {
    if (totals) return totals;
    return budgets.reduce(
      (acc, budget) => {
        acc.limit += budget.limitAmount;
        acc.spent += budget.spentAmount;
        return acc;
      },
      { limit: 0, spent: 0 }
    );
  }, [budgets, totals]);

  const resetForm = () => {
    const range = defaultPeriodRange();
    setEditingBudget(null);
    setFormValues({
      categoryId: categories[0]?.id ?? "",
      limitAmount: "",
      period: "monthly",
      periodStart: range.start,
      periodEnd: range.end,
    });
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormValues({
      categoryId: budget.categoryId ? String(budget.categoryId) : "",
      limitAmount: budget.limitAmount.toString(),
      period: budget.period,
      periodStart: budget.periodStart ?? "",
      periodEnd: budget.periodEnd ?? "",
    });
  };

  const handleDelete = async (budget) => {
    if (!budget?.id) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/budgets/${budget.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result?.error ?? "No se pudo eliminar el presupuesto");
      }
      setBudgets((prev) => prev.filter((item) => item.id !== budget.id));
      if (editingBudget?.id === budget.id) {
        resetForm();
      }
      startTransition(() => router.refresh());
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.categoryId || !formValues.limitAmount) {
      return;
    }
    const limitNumber = Number(formValues.limitAmount);
    if (limitNumber > availableBalance) {
      setFormError(
        `El límite no puede superar tu saldo disponible (${formatCurrency(availableBalance, currency)}).`
      );
      return;
    }
    setFormError("");
    setIsSubmitting(true);

    const payload = {
      userId,
      categoryId: Number(formValues.categoryId),
      limitAmount: limitNumber,
      period: formValues.period,
      periodStart: formValues.periodStart,
      periodEnd: formValues.periodEnd,
      status: "active",
    };

    const method = editingBudget ? "PUT" : "POST";
    const url = editingBudget ? `/api/budgets/${editingBudget.id}` : "/api/budgets";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? "No se pudo guardar el presupuesto");
      }

      setBudgets((prev) => {
        const filtered = editingBudget ? prev.filter((budget) => budget.id !== editingBudget.id) : prev;
        return [result.data, ...filtered];
      });

      resetForm();
      startTransition(() => router.refresh());
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <BudgetsHeader currency={currency} totals={summaryTotals} />
      <BudgetsChart currency={currency} budgets={chartData} />
      <BudgetsList budgets={budgets} currency={currency} onEdit={handleEdit} onDelete={handleDelete} />
      <BudgetForm
        categories={expenseCategories}
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        isEditing={Boolean(editingBudget)}
        isSubmitting={isSubmitting}
        availableBalance={availableBalance}
        currency={currency}
        errorMessage={formError}
      />
    </div>
  );
}
