import BudgetCard from "./BudgetCard";

const BUDGETS = [
  { id: 1, category: "Comida", limit: 500, spent: 320 },
  { id: 2, category: "Transporte", limit: 200, spent: 140 },
  { id: 3, category: "Ocio", limit: 250, spent: 180 },
];

export default function BudgetsList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {BUDGETS.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </div>
  );
}
