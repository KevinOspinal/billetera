"use client";

const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-400/30";

export default function Select({ label, options = [], className = "", ...props }) {
  const select = (
    <select className={[selectClass, className].filter(Boolean).join(" ")} {...props}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  if (!label) {
    return select;
  }

  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
      <span>{label}</span>
      {select}
    </label>
  );
}
