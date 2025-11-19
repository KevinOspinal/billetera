"use client";

export default function Avatar({ name = "Invitado" }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-base font-semibold text-white dark:bg-sky-500 dark:text-slate-900">
      {initials}
    </div>
  );
}
