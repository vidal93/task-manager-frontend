import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

// Interceptor funcional — agrega el token JWT a cada peticion HTTP
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = inject(AuthService).getToken();

    if (!token) return next(req);

    return next(
        req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
    );
};
