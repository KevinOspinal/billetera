import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

export default function IncomeVsExpensesChart() {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ingresos vs gastos</h3>
      <ProgressBar progress={65} />
      <p className="text-sm text-slate-500 dark:text-slate-400">Ingresos cubren el 65% de tus objetivos actuales.</p>
    </Card>
  );
}
