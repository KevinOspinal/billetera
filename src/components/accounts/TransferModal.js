"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

function buildInitialState(defaultFromId, defaultToId) {
  return {
    fromAccountId: defaultFromId ? String(defaultFromId) : "",
    toAccountId: defaultToId ? String(defaultToId) : "",
    amount: "",
    description: "Pago de tarjeta",
  };
}

export default function TransferModal({ open, accounts = [], defaultFromId, defaultToId, onClose, onSubmit }) {
  const [form, setForm] = useState(() => buildInitialState(defaultFromId, defaultToId));

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const accountOptions = useMemo(() => accounts.map((account) => ({ label: account.name, value: String(account.id) })), [accounts]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fromAccountId || !form.toAccountId || form.fromAccountId === form.toAccountId) {
      setError("Selecciona cuentas distintas");
      return;
    }

    const amountValue = Number(form.amount);
    if (!amountValue || amountValue <= 0) {
      setError("Ingresa un monto válido");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await onSubmit({
        fromAccountId: Number(form.fromAccountId),
        toAccountId: Number(form.toAccountId),
        amount: amountValue,
        description: form.description,
      });
    } catch (err) {
      setError(err.message ?? "No se pudo completar la transferencia");
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <Modal open={open} title="Transferencia / Abono">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Select
          label="Cuenta de origen"
          name="fromAccountId"
          options={accountOptions}
          value={form.fromAccountId}
          onChange={handleChange}
          placeholder="Selecciona una cuenta"
        />
        <Select
          label="Cuenta destino"
          name="toAccountId"
          options={accountOptions}
          value={form.toAccountId}
          onChange={handleChange}
          placeholder="Selecciona una cuenta"
        />
        <Input label="Monto" type="number" name="amount" value={form.amount} onChange={handleChange} min="0" step="0.01" required />
        <Input label="Descripción" name="description" value={form.description} onChange={handleChange} />

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Procesando..." : "Transferir"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
