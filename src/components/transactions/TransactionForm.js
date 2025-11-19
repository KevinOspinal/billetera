"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import TransactionField from "./TransactionField";
import TransactionTypeToggle from "./TransactionTypeToggle";

function buildOptions(items = []) {
  return items.map((item) => ({
    value: `${item.id}`,
    label: item.name,
  }));
}

export default function TransactionForm({ accounts = [], categories = [], defaultType = "expense", userId }) {
  const router = useRouter();
  const [type, setType] = useState(defaultType);
  const accountOptions = useMemo(() => buildOptions(accounts), [accounts]);
  const categoryOptions = useMemo(() => buildOptions(categories), [categories]);
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [form, setForm] = useState(() => ({
    description: "",
    accountId: accountOptions[0]?.value ?? "",
    categoryId: categoryOptions[0]?.value ?? "",
    amount: "",
    date: today,
    notes: "",
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasAccounts = accountOptions.length > 0;
  const hasCategories = categoryOptions.length > 0;
  const disableReason = !hasAccounts ? "Crea una cuenta antes de registrar movimientos" : !hasCategories ? "Crea una categoría antes de registrar movimientos" : null;

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

  useEffect(() => {
    setForm((prev) => {
      const nextAccountId = accountOptions.some((option) => option.value === prev.accountId) ? prev.accountId : accountOptions[0]?.value ?? "";
      const nextCategoryId = categoryOptions.some((option) => option.value === prev.categoryId) ? prev.categoryId : categoryOptions[0]?.value ?? "";

      if (nextAccountId === prev.accountId && nextCategoryId === prev.categoryId) {
        return prev;
      }

      return { ...prev, accountId: nextAccountId, categoryId: nextCategoryId };
    });
  }, [accountOptions, categoryOptions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    router.push("/transactions");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!userId) {
      setError("No se encontró el usuario activo.");
      return;
    }

    if (!hasAccounts || !hasCategories) {
      setError("Agrega al menos una cuenta y una categoría antes de registrar movimientos.");
      return;
    }

    const description = form.description.trim();
    const amount = Math.abs(Number(form.amount));
    const accountId = Number(form.accountId);
    const categoryId = Number(form.categoryId);
    const transactionDate = form.date;

    if (!description || !amount || !transactionDate || !Number.isFinite(accountId) || !Number.isFinite(categoryId)) {
      setError("Completa todos los campos obligatorios con valores válidos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          accountId,
          categoryId,
          type,
          amount,
          description,
          notes: form.notes.trim(),
          transactionDate,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "No se pudo guardar la transacción");
      }

      router.push("/transactions");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Registrar nuevo movimiento</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Completa los campos para guardar la transacción.</p>
          </div>
          <TransactionTypeToggle value={type} onChange={setType} />
        </div>

        {!hasAccounts || !hasCategories ? (
          <p className="rounded-xl border border-amber-200/70 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            Necesitas crear al menos una cuenta y una categoría para registrar movimientos.
          </p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <TransactionField label="Concepto">
            <Input
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </TransactionField>
          <TransactionField label="Categoría">
            <Select
              name="categoryId"
              options={categoryOptions}
              placeholder={hasCategories ? "Selecciona una categoría" : "No hay categorías"}
              value={form.categoryId}
              onChange={handleChange}
              required
              disabled={!hasCategories || loading}
            />
          </TransactionField>
          <TransactionField label="Cuenta">
            <Select
              name="accountId"
              options={accountOptions}
              placeholder={hasAccounts ? "Selecciona una cuenta" : "No hay cuentas"}
              value={form.accountId}
              onChange={handleChange}
              required
              disabled={!hasAccounts || loading}
            />
          </TransactionField>
          <TransactionField label="Monto">
            <Input
              name="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={form.amount}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </TransactionField>
          <TransactionField label="Fecha">
            <Input name="date" type="date" value={form.date} onChange={handleChange} required disabled={loading} />
          </TransactionField>
          <TransactionField label="Notas" className="md:col-span-2">
            <TextArea
              name="notes"
              rows={3}
              placeholder="Detalle opcional"
              value={form.notes}
              onChange={handleChange}
              disabled={loading}
            />
          </TransactionField>
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="ghost" type="button" onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || !hasAccounts || !hasCategories} title={disableReason ?? undefined}>
            {loading ? "Guardando..." : "Guardar movimiento"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
