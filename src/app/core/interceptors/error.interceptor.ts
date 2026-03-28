import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

// Interceptor funcional — maneja errores HTTP globalmente
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Token expirado o invalido — cerrar sesion y redirigir al login
                authService.logout();
                router.navigate(['/auth']);
            }
            return throwError(() => error);
        }),
    );
};
