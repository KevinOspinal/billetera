import SummaryCard from "./SummaryCard";

const SUMMARY = [
  { title: "Saldo disponible", value: "$12,340.00", description: "Saldo consolidado" },
  { title: "Ingresos mensuales", value: "$5,560.00", description: "Últimos 30 días" },
  { title: "Gastos mensuales", value: "$4,210.00", description: "Últimos 30 días" },
];

export default function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {SUMMARY.map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </div>
  );
}
