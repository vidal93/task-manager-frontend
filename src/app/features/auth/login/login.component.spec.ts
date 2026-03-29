import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
};
const mockAuthResponse = { data: mockUser, token: 'jwt-token' };

describe('LoginComponent', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let authService: AuthService;
    let userService: { findByEmail: jest.Mock; create: jest.Mock };
    let router: { navigate: jest.Mock };
    let dialog: { open: jest.Mock };

    beforeEach(async () => {
        localStorage.clear();

        userService = { findByEmail: jest.fn(), create: jest.fn() };
        router = { navigate: jest.fn() };
        dialog = { open: jest.fn() };

        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                provideNoopAnimations(),
                { provide: UserService, useValue: userService },
                { provide: Router, useValue: router },
                { provide: MatDialog, useValue: dialog },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService);
        fixture.detectChanges();
    });

    afterEach(() => localStorage.clear());

    it('debe crearse correctamente', () => {
        expect(component).toBeTruthy();
    });

    it('debe tener el formulario inválido cuando el correo está vacío', () => {
        expect(component.form.invalid).toBe(true);
    });

    it('debe tener el formulario válido con un correo válido', () => {
        component.form.setValue({ email: 'test@example.com' });
        expect(component.form.valid).toBe(true);
    });

    it('debe tener el formulario inválido cuando el correo no tiene TLD', () => {
        component.form.setValue({ email: 'ejemplo@gmailcom' });
        expect(component.form.invalid).toBe(true);
    });

    it('no debe enviar cuando el formulario es inválido', () => {
        component.onSubmit();
        expect(userService.findByEmail).not.toHaveBeenCalled();
    });

    it('debe llamar a findByEmail con el correo al enviar', () => {
        userService.findByEmail.mockReturnValue(of(mockAuthResponse));
        component.form.setValue({ email: 'test@example.com' });
        component.onSubmit();
        expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('debe guardar la sesión y navegar a /tasks al iniciar sesión correctamente', () => {
        const saveSpy = jest.spyOn(authService, 'saveSession');
        userService.findByEmail.mockReturnValue(of(mockAuthResponse));
        component.form.setValue({ email: 'test@example.com' });
        component.onSubmit();
        expect(saveSpy).toHaveBeenCalledWith(
            { token: 'jwt-token', userId: mockUser.id, email: mockUser.email },
            mockUser,
        );
        expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
    });

    it('debe abrir el diálogo de confirmación cuando el usuario no existe (404)', () => {
        const error = new HttpErrorResponse({ status: 404 });
        userService.findByEmail.mockReturnValue(throwError(() => error));
        dialog.open.mockReturnValue({ afterClosed: () => of(false) });
        component.form.setValue({ email: 'test@example.com' });
        component.onSubmit();
        expect(dialog.open).toHaveBeenCalled();
    });

    it('debe mostrar mensaje de error ante un error del servidor', () => {
        const error = new HttpErrorResponse({ status: 500 });
        userService.findByEmail.mockReturnValue(throwError(() => error));
        component.form.setValue({ email: 'test@example.com' });
        component.onSubmit();
        expect(component.errorMessage()).toBeTruthy();
    });

    it('debe crear el usuario y navegar cuando el diálogo es confirmado', () => {
        const saveSpy = jest.spyOn(authService, 'saveSession');
        const error = new HttpErrorResponse({ status: 404 });
        userService.findByEmail.mockReturnValue(throwError(() => error));
        userService.create.mockReturnValue(of(mockAuthResponse));
        dialog.open.mockReturnValue({ afterClosed: () => of(true) });
        component.form.setValue({ email: 'test@example.com' });
        component.onSubmit();
        expect(userService.create).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(saveSpy).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
    });

    it('debe redirigir a /tasks si ya está autenticado', async () => {
        TestBed.resetTestingModule();

        localStorage.setItem('auth_token', 'existing-token');
        localStorage.setItem('auth_user', JSON.stringify(mockUser));

        const newRouter = { navigate: jest.fn() };
        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                provideNoopAnimations(),
                { provide: UserService, useValue: { findByEmail: jest.fn(), create: jest.fn() } },
                { provide: Router, useValue: newRouter },
                { provide: MatDialog, useValue: { open: jest.fn() } },
            ],
        }).compileComponents();

        TestBed.createComponent(LoginComponent).detectChanges();
        expect(newRouter.navigate).toHaveBeenCalledWith(['/tasks']);
    });
});
