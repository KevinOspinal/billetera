"use client";

export default function Separator({ orientation = "horizontal", className = "" }) {
  if (orientation === "vertical") {
    return <span className={["inline-block w-px bg-slate-200 dark:bg-slate-700", className].filter(Boolean).join(" ")} aria-hidden="true" />;
  }
  return <hr className={["my-4 h-px border-0 bg-slate-200 dark:bg-slate-800", className].filter(Boolean).join(" ")} />;
}
