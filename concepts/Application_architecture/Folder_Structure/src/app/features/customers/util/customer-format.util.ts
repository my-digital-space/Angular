/**
 * Pure util function for customer initials formatting.
 * Zero Angular framework dependencies.
 */
export function formatCustomerInitials(fullName: string): string {
  if (!fullName) return '';
  return fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}
