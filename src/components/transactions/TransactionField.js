export default function TransactionField({ label, children, className = "" }) {
  return (
    <label className={["flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400", className].filter(Boolean).join(" ")}>
      <span>{label}</span>
      {children}
    </label>
  );
}
