import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function AccountCard({ account }) {
  const { name, balance, accountNumber } = account;
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{accountNumber}</p>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{name}</h3>
      </div>
      <p className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{balance}</p>
      <div className="flex flex-wrap gap-3">
        <Button size="sm">Transferir</Button>
        <Button variant="ghost" size="sm">
          Detalles
        </Button>
      </div>
    </Card>
  );
}
