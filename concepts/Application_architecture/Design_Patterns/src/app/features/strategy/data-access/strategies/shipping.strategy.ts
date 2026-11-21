export interface ShippingStrategy {
  readonly id: string;
  readonly label: string;
  readonly eta: string;
  readonly icon: string;
  calculateCost(orderWeightKg: number): number;
}

export class StandardShipping implements ShippingStrategy {
  readonly id = 'standard';
  readonly label = 'Standard Ground Delivery';
  readonly eta = '3 - 5 Business Days';
  readonly icon = '🚚';

  calculateCost(orderWeightKg: number): number {
    // Base ₹40 + ₹10 per kg
    return 40 + Math.round(orderWeightKg * 10);
  }
}

export class ExpressShipping implements ShippingStrategy {
  readonly id = 'express';
  readonly label = 'Express Air Courier';
  readonly eta = 'Guaranteed Next Day';
  readonly icon = '✈️';

  calculateCost(orderWeightKg: number): number {
    // Base ₹120 + ₹25 per kg
    return 120 + Math.round(orderWeightKg * 25);
  }
}

export class DroneDeliveryShipping implements ShippingStrategy {
  readonly id = 'drone';
  readonly label = 'Autonomous Drone Delivery';
  readonly eta = 'Within 45 Minutes';
  readonly icon = '🛸';

  calculateCost(orderWeightKg: number): number {
    // Base ₹250 + ₹50 per kg (Max 5kg limit)
    return 250 + Math.round(orderWeightKg * 50);
  }
}
