"use client";

import { useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const TYPE_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ingreso", value: "income" },
  { label: "Gasto", value: "expense" },
];

export default function TransactionsFilters({ accounts = [], categories = [], filters = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const accountOptions = useMemo(
    () => [{ label: "Todas", value: "" }, ...accounts.map((account) => ({ label: account.name, value: `${account.id}` }))],
    [accounts]
  );

  const categoryOptions = useMemo(
    () => [{ label: "Todas", value: "" }, ...categories.map((category) => ({ label: category.name, value: `${category.id}` }))],
    [categories]
  );

  const filterValues = {
    type: filters?.type ?? "",
    categoryId: filters?.categoryId ?? "",
    accountId: filters?.accountId ?? "",
    startDate: filters?.startDate ?? "",
    endDate: filters?.endDate ?? "",
  };

  const updateQuery = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page");

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="grid gap-4 rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/40 sm:grid-cols-2 lg:grid-cols-4">
      <Select
        label="Tipo"
        options={TYPE_OPTIONS}
        value={filterValues.type}
        onChange={(event) => updateQuery("type", event.target.value)}
      />
      <Select
        label="Categoría"
        options={categoryOptions}
        value={filterValues.categoryId}
        onChange={(event) => updateQuery("category", event.target.value)}
      />
      <Select
        label="Cuenta"
        options={accountOptions}
        value={filterValues.accountId}
        onChange={(event) => updateQuery("account", event.target.value)}
      />
      <div className="grid gap-3 sm:col-span-2 lg:col-span-1 lg:grid-cols-2">
        <Input
          label="Desde"
          type="date"
          value={filterValues.startDate}
          onChange={(event) => updateQuery("start", event.target.value)}
        />
        <Input label="Hasta" type="date" value={filterValues.endDate} onChange={(event) => updateQuery("end", event.target.value)} />
      </div>
    </div>
  );
}
