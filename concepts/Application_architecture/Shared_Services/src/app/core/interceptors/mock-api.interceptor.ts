import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { OrderReceipt } from '../../shared/data-access/cart/cart.model';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url === '/api/v1/checkout' && req.method === 'POST') {
    const body = req.body as { items: unknown[]; coupon: string | null; totalPaid: number };
    const receipt: OrderReceipt = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      paidAmount: body?.totalPaid ?? 0,
      timestamp: new Date().toISOString()
    };

    // Simulate network latency (600ms) before returning receipt
    return of(new HttpResponse({ status: 200, body: receipt })).pipe(
      delay(600)
    );
  }

  return next(req);
};
