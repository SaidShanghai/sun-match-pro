/**
 * Format a phone number as XX XX XX XX XX
 * Strips non-digit chars (except leading +), then groups by 2.
 */
export function formatPhoneInput(raw: string): string {
  // Keep leading + if present
  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");

  // Group digits by pairs
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 2) {
    groups.push(digits.slice(i, i + 2));
  }

  const formatted = groups.join(" ");
  return hasPlus ? `+${formatted}` : formatted;
}
