import { describe, it, expect } from 'vitest';
import { calculateFinalOrderTotal } from './order-price.util';

describe('calculateFinalOrderTotal (Pure Util Function)', () => {
  it('should accurately compute total with 18% tax', () => {
    const total = calculateFinalOrderTotal(2500, 0.18);
    // 2500 + (2500 * 0.18) = 2950
    expect(total).toBe(2950);
  });

  it('should round cents to 2 decimal places properly', () => {
    const total = calculateFinalOrderTotal(99.99, 0.05);
    // 99.99 * 0.05 = 4.9995 -> 99.99 + 4.9995 = 104.9895 -> rounded = 104.99
    expect(total).toBe(104.99);
  });

  it('should handle zero tax rate correctly', () => {
    const total = calculateFinalOrderTotal(500, 0);
    expect(total).toBe(500);
  });
});
