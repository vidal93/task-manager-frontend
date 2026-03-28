import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

// Guard funcional — protege rutas que requieren autenticacion
export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.isAuthenticated() || router.createUrlTree(['/auth']);
};
