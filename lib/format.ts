const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-AU", {
  currency: "AUD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: "currency",
});

function parseIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function formatDate(value: string): string {
  return DATE_FORMATTER.format(parseIsoDate(value));
}

export function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(value);
}
