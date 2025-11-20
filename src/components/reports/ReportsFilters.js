"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

function formatDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const QUICK_RANGES = [
  {
    id: "month",
    label: "Mes actual",
    buildRange() {
      const today = new Date();
      return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: today };
    },
  },
  {
    id: "30d",
    label: "Últimos 30 días",
    buildRange() {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return { start, end };
    },
  },
  {
    id: "quarter",
    label: "Último trimestre",
    buildRange() {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return { start, end };
    },
  },
];

export default function ReportsFilters({ initialFilters, accounts = [], categories = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState({
    startDate: initialFilters?.startDate ? formatDate(initialFilters.startDate) : "",
    endDate: initialFilters?.endDate ? formatDate(initialFilters.endDate) : "",
    accountId: initialFilters?.accountId ?? "",
    categoryId: initialFilters?.categoryId ?? "",
  });

  const accountOptions = useMemo(() => {
    const options = [{ label: "Todas las cuentas", value: "" }];
    accounts.forEach((account) => {
      options.push({ label: account.name, value: String(account.id) });
    });
    return options;
  }, [accounts]);

  const categoryOptions = useMemo(() => {
    const options = [{ label: "Todas las categorías", value: "" }];
    categories.forEach((category) => {
      options.push({ label: category.name, value: String(category.id) });
    });
    return options;
  }, [categories]);

  function handleFieldChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function buildQueryString(nextValues) {
    const params = new URLSearchParams();
    if (nextValues.startDate) params.set("startDate", nextValues.startDate);
    if (nextValues.endDate) params.set("endDate", nextValues.endDate);
    if (nextValues.accountId) params.set("accountId", nextValues.accountId);
    if (nextValues.categoryId) params.set("categoryId", nextValues.categoryId);
    const query = params.toString();
    return query ? `/reports?${query}` : "/reports";
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextValues = { ...values };
    startTransition(() => {
      router.push(buildQueryString(nextValues));
    });
  }

  function handleReset() {
    const resetValues = { startDate: "", endDate: "", accountId: "", categoryId: "" };
    setValues(resetValues);
    startTransition(() => {
      router.push("/reports");
    });
  }

  function applyQuickRange(rangeId) {
    const quick = QUICK_RANGES.find((option) => option.id === rangeId);
    if (!quick) return;
    const built = quick.buildRange();
    const nextValues = {
      ...values,
      startDate: formatDate(built.start),
      endDate: formatDate(built.end),
    };
    setValues(nextValues);
    startTransition(() => {
      router.push(buildQueryString(nextValues));
    });
  }

  return (
    <form
      className="space-y-4 rounded-2xl bg-white/80 p-4 shadow-sm transition dark:bg-slate-900/40"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-wrap gap-2">
        {QUICK_RANGES.map((option) => (
          <button
            key={option.id}
            type="button"
            className="rounded-full border border-slate-200/70 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
            onClick={() => applyQuickRange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Desde"
          type="date"
          value={values.startDate}
          onChange={(event) => handleFieldChange("startDate", event.target.value)}
        />
        <Input
          label="Hasta"
          type="date"
          value={values.endDate}
          onChange={(event) => handleFieldChange("endDate", event.target.value)}
        />
        <Select
          label="Cuenta"
          options={accountOptions}
          value={values.accountId}
          onChange={(event) => handleFieldChange("accountId", event.target.value)}
        />
        <Select
          label="Categoría"
          options={categoryOptions}
          value={values.categoryId}
          onChange={(event) => handleFieldChange("categoryId", event.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          disabled={isPending}
        >
          Aplicar filtros
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
          onClick={handleReset}
          disabled={isPending}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
