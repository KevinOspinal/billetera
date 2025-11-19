"use client";

const variants = {
  default: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-100",
  success: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200",
  danger: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200",
};

export default function Badge({ children, variant = "default" }) {
  const classes = [
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
    variants[variant] ?? variants.default,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
