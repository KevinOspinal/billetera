export default function DashboardHeader() {
  return (
    <div className="space-y-1 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur dark:bg-slate-900/40">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Dashboard</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Visión general del estado financiero y actividad reciente.
      </p>
    </div>
  );
}
