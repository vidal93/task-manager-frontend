import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
    let authService: AuthService;
    let router: Router;

    const runGuard = () =>
        TestBed.runInInjectionContext(() => authGuard());

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Router,
                    useValue: { createUrlTree: (commands: string[]) => commands },
                },
            ],
        });
        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('debe retornar true cuando el usuario está autenticado', () => {
        authService.saveSession(
            { token: 'valid-token', userId: 'u1', email: 'a@a.com' },
            { id: 'u1', email: 'a@a.com', createdAt: '2024-01-01T00:00:00.000Z' }
        );
        expect(runGuard()).toBe(true);
    });

    it('debe redirigir a /auth cuando el usuario no está autenticado', () => {
        const result = runGuard();
        expect(result).toEqual(['/auth']);
    });
});
