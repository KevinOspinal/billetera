import Card from "@/components/ui/Card";

export default function SummaryCard({ title, value, description }) {
  return (
    <Card className="space-y-2">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </Card>
  );
}
