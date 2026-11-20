/**
 * Pure TypeScript function with zero Angular dependencies.
 * Can be unit-tested instantly without Angular's TestBed.
 */
export function calculateFinalOrderTotal(subtotal: number, taxRate: number): number {
  const taxAmount = subtotal * taxRate;
  return Math.round((subtotal + taxAmount) * 100) / 100;
}
