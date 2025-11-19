import Card from "@/components/ui/Card";

const METRICS = [
  { metric: "Ingresos", current: "$12,500", previous: "$11,300" },
  { metric: "Gastos", current: "$8,200", previous: "$8,450" },
  { metric: "Ahorro", current: "$4,300", previous: "$2,850" },
];

export default function ReportsTable() {
  return (
    <Card className="p-0">
      <div className="grid grid-cols-3 gap-4 border-b border-slate-100 px-6 py-4 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-300">
        <span>Métrica</span>
        <span>Actual</span>
        <span>Anterior</span>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {METRICS.map((row) => (
          <div key={row.metric} className="grid grid-cols-3 gap-4 px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{row.metric}</span>
            <span>{row.current}</span>
            <span>{row.previous}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
