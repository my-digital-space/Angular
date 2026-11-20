/**
 * Public API (Barrel File) for Orders Feature
 * Only expose what external parts of the app are allowed to use.
 * Internal items (order-card.component, order-price.util) remain strictly private.
 */
export { ORDER_ROUTES } from './orders.routes';
export type { Order, OrderStatus } from './data-access/order.model';
