import { TestBed } from '@angular/core/testing';
import {
    HttpClient,
    provideHttpClient,
    withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
};

describe('authInterceptor', () => {
    let httpMock: HttpTestingController;
    let http: HttpClient;
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
            ],
        });

        httpMock = TestBed.inject(HttpTestingController);
        http = TestBed.inject(HttpClient);
        authService = TestBed.inject(AuthService);
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('debe agregar el header Authorization cuando existe el token', () => {
        authService.saveSession(
            { token: 'valid-token', userId: 'user-1', email: 'test@example.com' },
            mockUser,
        );

        http.get('/api/tasks').subscribe();

        const req = httpMock.expectOne('/api/tasks');
        expect(req.request.headers.get('Authorization')).toBe('Bearer valid-token');
        req.flush({});
    });

    it('no debe agregar el header Authorization cuando no existe el token', () => {
        http.get('/api/tasks').subscribe();

        const req = httpMock.expectOne('/api/tasks');
        expect(req.request.headers.get('Authorization')).toBeNull();
        req.flush({});
    });
});
