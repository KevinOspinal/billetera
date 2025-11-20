"use client";

export default function Tabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-xs font-medium dark:bg-slate-800">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            className={`rounded-full px-3 py-1 transition ${
              isActive
                ? "bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
            }`}
            onClick={() => onChange?.(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
