export default function ExpensesByCategoryChart() {
  const categories = [
    { label: "Vivienda", value: 35 },
    { label: "Transporte", value: 20 },
    { label: "Comida", value: 25 },
    { label: "Otros", value: 20 },
  ];

  return (
    <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
      {categories.map((category) => (
        <li key={category.label} className="flex items-center justify-between">
          <span>{category.label}</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{category.value}%</span>
        </li>
      ))}
    </ul>
  );
}
