import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function TransactionsFilters() {
  return (
    <div className="grid gap-4 rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/40 sm:grid-cols-2 lg:grid-cols-4">
      <Select label="Tipo" options={["Todos", "Ingreso", "Gasto"]} />
      <Select label="Categoría" options={["Todas", "Casa", "Transporte", "Ocio"]} />
      <Select label="Cuenta" options={["Todas", "Principal", "Tarjeta"]} />
      <div className="grid gap-3 sm:col-span-2 lg:col-span-1 lg:grid-cols-2">
        <Input label="Desde" type="date" />
        <Input label="Hasta" type="date" />
      </div>
    </div>
  );
}
