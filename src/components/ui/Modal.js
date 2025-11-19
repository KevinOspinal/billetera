"use client";

export default function Modal({ open, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {title && <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h4>}
        <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-200">{children}</div>
      </div>
    </div>
  );
}
