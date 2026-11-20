import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Core Auth Interceptor (Functional)
 * Intercepts outgoing HTTP requests and attaches authorization credentials.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // In production, retrieve token from secure storage or auth service
  const authToken = 'dummy-prod-jwt-token';

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  return next(authReq);
};
