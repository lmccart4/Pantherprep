export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (24 * 3600 * 1000));
}

export function weeksRemaining(today: Date, testDate: Date): number {
  return Math.max(0, Math.floor(daysBetween(today, testDate) / 7));
}

export function isRestDay(d: Date): boolean {
  return d.getDay() === 0;
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}
