import Button from "@/components/ui/Button";

export default function DashboardActions() {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur dark:bg-slate-900/40">
      <Button variant="secondary">Añadir gasto</Button>
      <Button variant="ghost">Añadir ingreso</Button>
    </div>
  );
}
