import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function ReportsFilters() {
  return (
    <div className="grid gap-4 rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/40 md:grid-cols-2 lg:grid-cols-4">
      <Input label="Desde" type="date" />
      <Input label="Hasta" type="date" />
      <Select label="Cuenta" options={["Todas", "Principal", "Tarjeta"]} />
      <Select label="Categoría" options={["Todas", "Casa", "Transporte", "Ocio"]} />
    </div>
  );
}
