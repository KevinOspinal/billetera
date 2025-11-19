import Link from "next/link";

function buildPageHref(page, query = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const queryString = params.toString();
  return queryString ? `/transactions?${queryString}` : "/transactions";
}

export default function TransactionsPagination({ currentPage = 1, totalPages = 1, query = {} }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const baseClasses =
    "inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800";

  const renderNavButton = (label, targetPage, isEnabled) => {
    if (!isEnabled) {
      return (
        <span className={`${baseClasses} cursor-not-allowed border-transparent text-slate-400 dark:text-slate-500`} aria-disabled="true">
          {label}
        </span>
      );
    }

    return (
      <Link
        className={`${baseClasses} border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200`}
        href={buildPageHref(targetPage, query)}
        aria-label={`${label} página`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav aria-label="Paginación de transacciones" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
      {renderNavButton("Anterior", currentPage - 1, hasPrev)}
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              className={`${baseClasses} ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white dark:border-sky-400 dark:bg-sky-400 dark:text-slate-900"
                  : "border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
              }`}
              aria-current={isActive ? "page" : undefined}
              href={buildPageHref(page, query)}
            >
              {page}
            </Link>
          );
        })}
      </div>
      {renderNavButton("Siguiente", currentPage + 1, hasNext)}
    </nav>
  );
}
