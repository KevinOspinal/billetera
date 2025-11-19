"use client";

export default function Card({ children, className = "" }) {
  const classes = [
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 transition-colors dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-950/50",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
