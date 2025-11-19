import Card from "@/components/ui/Card";

export default function CategoryTrendsChart() {
  const items = [
    { label: "Comida", change: "+12%" },
    { label: "Transporte", change: "-4%" },
    { label: "Educación", change: "+3%" },
  ];

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tendencias por categoría</h3>
      <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between">
            <span>{item.label}</span>
            <strong className="text-base text-slate-900 dark:text-slate-100">{item.change}</strong>
          </li>
        ))}
      </ul>
    </Card>
  );
}
