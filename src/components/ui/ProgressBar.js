"use client";

export default function ProgressBar({ progress = 0 }) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
      <div className="h-full rounded-full bg-emerald-500 transition-all dark:bg-emerald-400" style={{ width: `${clamped}%` }} />
    </div>
  );
}
