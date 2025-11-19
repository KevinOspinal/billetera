import Button from "@/components/ui/Button";

export default function TransactionTypeToggle({ value, onChange }) {
  const isExpense = value === "expense";

  return (
    <div className="inline-flex gap-2 rounded-full bg-slate-100 p-1 text-xs font-medium dark:bg-slate-800">
      <Button variant={isExpense ? "secondary" : "ghost"} size="sm" type="button" onClick={() => onChange?.("expense")}>
        Gasto
      </Button>
      <Button variant={!isExpense ? "secondary" : "ghost"} size="sm" type="button" onClick={() => onChange?.("income")}>
        Ingreso
      </Button>
    </div>
  );
}
