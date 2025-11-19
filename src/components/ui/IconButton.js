"use client";

export default function IconButton({ icon, label, className = "", ...props }) {
  const classes = [
    "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-lg text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button aria-label={label} className={classes} {...props}>
      {icon}
    </button>
  );
}
