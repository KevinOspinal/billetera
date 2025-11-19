import Badge from "@/components/ui/Badge";

const LABELS = {
  income: "Ingreso",
  expense: "Gasto",
};

export default function TransactionTypeBadge({ type = "income" }) {
  const label = LABELS[type] ?? "Movimiento";
  const variant = type === "income" ? "success" : "danger";

  return <Badge variant={variant}>{label}</Badge>;
}
