"use client";

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variantClass = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900 dark:bg-sky-400 dark:text-slate-900 dark:hover:bg-sky-300",
  secondary:
    "bg-sky-600 text-white hover:bg-sky-500 focus-visible:outline-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400",
  ghost:
    "border border-slate-200 text-slate-800 hover:bg-slate-100 focus-visible:outline-slate-300 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-600",
};

const sizeClass = {
  md: "px-5 py-2 text-sm",
  sm: "px-4 py-1.5 text-xs",
};

export default function Button({ variant = "primary", size = "md", className = "", ...props }) {
  const classes = [baseClass, variantClass[variant] ?? variantClass.primary, sizeClass[size] ?? sizeClass.md, className]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}
