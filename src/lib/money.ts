const CURRENCY_PREFIX: Record<string, string> = {
  DOP: "RD$",
};

export function formatMoney(amount: string, currency: string): string {
  const prefix = CURRENCY_PREFIX[currency] ?? currency;
  const negative = amount.startsWith("-");
  const unsigned = negative ? amount.slice(1) : amount;
  const [wholeRaw = "0", fractionRaw = ""] = unsigned.split(".");
  const whole = wholeRaw.replace(/^0+(?=\d)/, "") || "0";
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fraction = `${fractionRaw}00`.slice(0, 2);

  return `${prefix} ${negative ? "-" : ""}${grouped}.${fraction}`;
}
