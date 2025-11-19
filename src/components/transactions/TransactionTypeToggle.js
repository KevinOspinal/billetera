import Button from "@/components/ui/Button";

export default function TransactionTypeToggle() {
  return (
    <div className="inline-flex gap-2 rounded-full bg-slate-100 p-1 text-xs font-medium dark:bg-slate-800">
      <Button variant="secondary" size="sm">
        Gasto
      </Button>
      <Button variant="ghost" size="sm">
        Ingreso
      </Button>
    </div>
  );
}
