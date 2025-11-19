"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const ACCOUNT_TYPES = [
  { label: "Cuenta bancaria", value: "bank" },
  { label: "Tarjeta de crédito", value: "credit" },
  { label: "Efectivo", value: "cash" },
  { label: "Préstamo", value: "loan" },
];

const STATUS_OPTIONS = [
  { label: "Activa", value: "active" },
  { label: "Principal", value: "primary" },
  { label: "Inactiva", value: "inactive" },
];

const CURRENCIES = [
  { label: "COP", value: "COP" },
  { label: "USD", value: "USD" },
];

const emptyFormState = {
  name: "",
  type: "bank",
  currency: "COP",
  status: "active",
  initialBalance: "0",
  currentBalance: "0",
};

function buildInitialForm(account, isEdit) {
  if (account && isEdit) {
    return {
      name: account.name ?? "",
      type: account.type ?? "bank",
      currency: account.currency ?? "COP",
      status: account.status ?? "active",
      initialBalance: String(account.initialBalance ?? 0),
      currentBalance: String(account.currentBalance ?? 0),
    };
  }
  return { ...emptyFormState };
}

export default function AccountFormModal({ open, mode = "create", account, onClose, onSubmit }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(() => buildInitialForm(account, isEdit));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        currency: form.currency,
        status: form.status,
      };

      if (isEdit) {
        payload.currentBalance = Number(form.currentBalance ?? 0);
        payload.initialBalance = Number(form.initialBalance ?? 0);
      } else {
        payload.initialBalance = Number(form.initialBalance ?? 0);
      }

      await onSubmit(payload);
    } catch (err) {
      setError(err.message ?? "No se pudo guardar la cuenta");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <Modal open={open} title={isEdit ? "Editar cuenta" : "Nueva cuenta"}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Nombre" name="name" value={form.name} onChange={handleChange} required />
        <Select label="Tipo" name="type" options={ACCOUNT_TYPES} value={form.type} onChange={handleChange} />
        <Select label="Moneda" name="currency" options={CURRENCIES} value={form.currency} onChange={handleChange} />
        <Select label="Estado" name="status" options={STATUS_OPTIONS} value={form.status} onChange={handleChange} />
        {!isEdit ? (
          <Input label="Saldo inicial" type="number" name="initialBalance" value={form.initialBalance} onChange={handleChange} min="0" step="0.01" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Saldo inicial" type="number" name="initialBalance" value={form.initialBalance} onChange={handleChange} step="0.01" />
            <Input label="Saldo actual" type="number" name="currentBalance" value={form.currentBalance} onChange={handleChange} step="0.01" />
          </div>
        )}

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
