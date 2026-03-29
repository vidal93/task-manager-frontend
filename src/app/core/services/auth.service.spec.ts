import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { AuthToken } from '../models/api-response.model';

const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
};

const mockAuthToken: AuthToken = {
    token: 'jwt-token-123',
    userId: 'user-1',
    email: 'test@example.com',
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({});
        service = TestBed.inject(AuthService);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('debe crearse correctamente', () => {
        expect(service).toBeTruthy();
    });

    it('no debe estar autenticado cuando localStorage está vacío', () => {
        expect(service.isAuthenticated()).toBe(false);
        expect(service.currentUser()).toBeNull();
    });

    it('debe guardar la sesión y actualizar el estado autenticado', () => {
        service.saveSession(mockAuthToken, mockUser);
        expect(service.isAuthenticated()).toBe(true);
        expect(service.currentUser()).toEqual(mockUser);
    });

    it('debe persistir token y usuario en localStorage al guardar sesión', () => {
        service.saveSession(mockAuthToken, mockUser);
        expect(localStorage.getItem('auth_token')).toBe(mockAuthToken.token);
        expect(JSON.parse(localStorage.getItem('auth_user')!)).toEqual(mockUser);
    });

    it('debe retornar el token guardado', () => {
        service.saveSession(mockAuthToken, mockUser);
        expect(service.getToken()).toBe(mockAuthToken.token);
    });

    it('debe retornar el userId cuando el usuario está autenticado', () => {
        service.saveSession(mockAuthToken, mockUser);
        expect(service.getUserId()).toBe(mockUser.id);
    });

    it('debe retornar null en getUserId cuando no está autenticado', () => {
        expect(service.getUserId()).toBeNull();
    });

    it('debe limpiar el estado y localStorage al cerrar sesión', () => {
        service.saveSession(mockAuthToken, mockUser);
        service.logout();
        expect(service.isAuthenticated()).toBe(false);
        expect(service.currentUser()).toBeNull();
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(localStorage.getItem('auth_user')).toBeNull();
    });
});
