import { TestBed } from '@angular/core/testing';
import {
    HttpClient,
    HttpErrorResponse,
    provideHttpClient,
    withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';

describe('errorInterceptor', () => {
    let httpMock: HttpTestingController;
    let http: HttpClient;
    let authService: AuthService;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([errorInterceptor])),
                provideHttpClientTesting(),
                {
                    provide: Router,
                    useValue: { navigate: jest.fn() },
                },
            ],
        });

        httpMock = TestBed.inject(HttpTestingController);
        http = TestBed.inject(HttpClient);
        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('debe llamar a logout y redirigir a /auth al recibir 401', () => {
        const logoutSpy = jest.spyOn(authService, 'logout');

        http.get('/api/test').subscribe({ error: () => {} });

        httpMock.expectOne('/api/test').flush(
            { error: 'No autorizado' },
            { status: 401, statusText: 'Unauthorized' },
        );

        expect(logoutSpy).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });

    it('debe propagar el error en respuestas que no son 401', () => {
        let capturedError: HttpErrorResponse | undefined;

        http.get('/api/test').subscribe({ error: (err) => (capturedError = err) });

        httpMock.expectOne('/api/test').flush(
            { error: 'Error interno' },
            { status: 500, statusText: 'Internal Server Error' },
        );

        expect(capturedError?.status).toBe(500);
    });
});
