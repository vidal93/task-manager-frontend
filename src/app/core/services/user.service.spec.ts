import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { User, CreateUserDto } from '../models/user.model';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/users`;

const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
};

const mockAuthResponse = {
    data: mockUser,
    token: 'jwt-token-123',
};

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('debe crearse correctamente', () => {
        expect(service).toBeTruthy();
    });

    describe('findByEmail', () => {
        it('debe obtener el usuario por correo y retornar la respuesta de autenticación', () => {
            service.findByEmail('test@example.com').subscribe((response) => {
                expect(response.data).toEqual(mockUser);
                expect(response.token).toBe('jwt-token-123');
            });

            const req = httpMock.expectOne(
                `${API_URL}?email=${encodeURIComponent('test@example.com')}`,
            );
            expect(req.request.method).toBe('GET');
            req.flush(mockAuthResponse);
        });
    });

    describe('create', () => {
        it('debe crear un nuevo usuario y retornar la respuesta de autenticación', () => {
            const dto: CreateUserDto = { email: 'new@example.com' };

            service.create(dto).subscribe((response) => {
                expect(response.data).toEqual(mockUser);
                expect(response.token).toBe('jwt-token-123');
            });

            const req = httpMock.expectOne(API_URL);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(dto);
            req.flush(mockAuthResponse);
        });
    });
});
