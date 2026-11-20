import { describe, it, expect } from 'vitest';
import { calculateDiscountedPrice } from './product-discount.util';

describe('calculateDiscountedPrice (util/)', () => {
  it('should compute price with 10% discount', () => {
    const discounted = calculateDiscountedPrice(1000, 0.1);
    expect(discounted).toBe(900);
  });

  it('should return original price when discount is zero', () => {
    const discounted = calculateDiscountedPrice(500, 0);
    expect(discounted).toBe(500);
  });
});
