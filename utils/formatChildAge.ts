/**
 * Returns an age label from an ISO YYYY-MM-DD birth date.
 * Examples:
 *   "5 months old"  (< 1 year)
 *   "1 month old"   (singular)
 *   "18 months old" (< 2 years; under 24 months we still use months for clarity)
 *   "3 years old"   (>= 2 years)
 *   "1 year old"
 *   "5 days old"    (very young)
 *   ""              (no/invalid date)
 */
export function formatChildAge(isoBirthDate: string | null | undefined): string {
  if (!isoBirthDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoBirthDate)) return '';
  const [y, m, d] = isoBirthDate.split('-').map(Number);
  const birth = new Date(y, m - 1, d);
  const now = new Date();
  if (birth > now) return '';

  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth()) -
    (now.getDate() < birth.getDate() ? 1 : 0);

  if (months < 24) {
    if (months <= 0) {
      const days = Math.max(
        0,
        Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)),
      );
      return `${days} ${days === 1 ? 'day' : 'days'} old`;
    }
    return `${months} ${months === 1 ? 'month' : 'months'} old`;
  }

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'} old`;
}
