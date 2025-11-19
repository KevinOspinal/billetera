import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function BudgetForm() {
  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Crear / editar presupuesto</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Define límites por categoría para controlar tus gastos.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Select label="Categoría" options={["Comida", "Transporte", "Ocio", "Educación"]} />
        <Input label="Límite" type="number" placeholder="0.00" />
        <Input label="Periodo" placeholder="Mensual" />
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" type="reset">
          Cancelar
        </Button>
        <Button type="submit">Guardar presupuesto</Button>
      </div>
    </Card>
  );
}
