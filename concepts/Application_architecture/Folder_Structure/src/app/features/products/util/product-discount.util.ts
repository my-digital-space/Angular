/**
 * Pure util function for calculating discounted product price.
 * Zero Angular framework dependencies.
 */
export function calculateDiscountedPrice(price: number, discountRate: number): number {
  if (discountRate <= 0) return price;
  const discounted = price - price * discountRate;
  return Math.round(discounted * 100) / 100;
}
