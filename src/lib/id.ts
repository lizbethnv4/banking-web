export function formatShortId(value: string) {
  const digits = value.replace(/-/g, "");

  if (!digits) {
    return value;
  }

  return digits.slice(-8);
}
