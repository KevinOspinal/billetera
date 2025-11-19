import { formatCurrency, formatMonthYear } from "@/lib/format";
import SummaryCard from "./SummaryCard";

export default function SummaryCards({ summary }) {
  const {
    currency = "COP",
    availableBalance = 0,
    monthlyIncome = 0,
    monthlyExpenses = 0,
    month,
  } = summary ?? {};

  const monthLabel = month ? formatMonthYear(month) : "Mes más reciente";

  const cards = [
    {
      title: "Saldo disponible",
      value: formatCurrency(availableBalance, currency),
      description: month ? `Neto de ${monthLabel}` : "Neto del mes más reciente",
    },
    {
      title: "Ingresos mensuales",
      value: formatCurrency(monthlyIncome, currency),
      description: month ? `Mes: ${monthLabel}` : "Mes más reciente",
    },
    {
      title: "Gastos mensuales",
      value: formatCurrency(monthlyExpenses, currency),
      description: month ? `Mes: ${monthLabel}` : "Mes más reciente",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </div>
  );
}
