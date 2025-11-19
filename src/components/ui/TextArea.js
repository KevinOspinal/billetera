"use client";

const textareaClass =
  "w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-400/30";

export default function TextArea({ className = "", ...props }) {
  return <textarea className={[textareaClass, className].filter(Boolean).join(" ")} {...props} />;
}
