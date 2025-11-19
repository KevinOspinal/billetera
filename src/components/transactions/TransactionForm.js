import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import TransactionField from "./TransactionField";
import TransactionTypeToggle from "./TransactionTypeToggle";

export default function TransactionForm() {
  return (
    <Card className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Registrar nuevo movimiento</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Completa los campos para guardar la transacción.</p>
        </div>
        <TransactionTypeToggle />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TransactionField label="Concepto">
          <Input placeholder="Descripción" />
        </TransactionField>
        <TransactionField label="Categoría">
          <Select options={["Salario", "Alquiler", "Transporte", "Comida"]} />
        </TransactionField>
        <TransactionField label="Cuenta">
          <Select options={["Cuenta principal", "Tarjeta crédito", "Efectivo"]} />
        </TransactionField>
        <TransactionField label="Monto">
          <Input type="number" placeholder="0.00" />
        </TransactionField>
        <TransactionField label="Fecha">
          <Input type="date" />
        </TransactionField>
        <TransactionField label="Notas" className="md:col-span-2">
          <TextArea rows={3} placeholder="Detalle opcional" />
        </TransactionField>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="ghost" type="reset">
          Cancelar
        </Button>
        <Button type="submit">Guardar movimiento</Button>
      </div>
    </Card>
  );
}
