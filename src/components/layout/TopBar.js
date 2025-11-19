import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Separator from "@/components/ui/Separator";
import ThemeToggle from "./ThemeToggle";

export default function TopBar() {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Inicio / Dashboard</p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Panel financiero</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost">Añadir ingreso</Button>
        <Button>Registrar gasto</Button>
        <Separator orientation="vertical" className="hidden h-6 sm:inline-flex" />
        <IconButton label="Abrir menú" icon="⋯" />
      </div>
    </header>
  );
}
