import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { formatCurrency } from "@/lib/format";

const PERIOD_OPTIONS = [
  { label: "Mensual", value: "monthly" },
  { label: "Semanal", value: "weekly" },
  { label: "Trimestral", value: "quarterly" },
];

export default function BudgetForm({
  categories = [],
  values,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  isSubmitting,
  availableBalance = 0,
  currency = "COP",
  errorMessage,
}) {
  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{isEditing ? "Editar presupuesto" : "Crear presupuesto"}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Define límites por categoría para controlar tus gastos. Saldo disponible actual:{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {formatCurrency(availableBalance, currency)}
          </span>
          .
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Categoría"
            options={categories}
            value={values.categoryId}
            onChange={(event) => onChange((prev) => ({ ...prev, categoryId: event.target.value }))}
          />
          <Input
            label="Límite"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={values.limitAmount}
            onChange={(event) => onChange((prev) => ({ ...prev, limitAmount: event.target.value }))}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Select
            label="Periodo"
            options={PERIOD_OPTIONS}
            value={values.period}
            onChange={(event) => onChange((prev) => ({ ...prev, period: event.target.value }))}
          />
          <Input
            label="Desde"
            type="date"
            value={values.periodStart}
            onChange={(event) => onChange((prev) => ({ ...prev, periodStart: event.target.value }))}
            required
          />
          <Input
            label="Hasta"
            type="date"
            value={values.periodEnd}
            onChange={(event) => onChange((prev) => ({ ...prev, periodEnd: event.target.value }))}
            required
          />
        </div>
        {errorMessage ? <p className="text-sm text-rose-400">{errorMessage}</p> : null}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar presupuesto"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
