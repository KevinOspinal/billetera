"use client";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-400/30";

export default function Input({ label, className = "", ...props }) {
  const input = <input className={[inputClass, className].filter(Boolean).join(" ")} {...props} />;

  if (!label) {
    return input;
  }

  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
      <span>{label}</span>
      {input}
    </label>
  );
}
