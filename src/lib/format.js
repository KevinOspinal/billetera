const currencyFormatters = new Map();

function getCurrencyFormatter(currency = "COP") {
  const key = currency.toUpperCase();
  if (!currencyFormatters.has(key)) {
    currencyFormatters.set(
      key,
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: key,
        maximumFractionDigits: 2,
      })
    );
  }
  return currencyFormatters.get(key);
}

export function formatCurrency(value, currency = "COP") {
  const formatter = getCurrencyFormatter(currency);
  const amount = Number(value);
  return formatter.format(Number.isFinite(amount) ? amount : 0);
}

export function formatShortDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function formatMonthYear(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(date);
}
