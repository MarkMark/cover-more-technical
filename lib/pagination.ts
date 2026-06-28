export function parsePositivePage(
  value: string | string[] | undefined,
): number {
  const pageValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(pageValue ?? "", 10);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}
