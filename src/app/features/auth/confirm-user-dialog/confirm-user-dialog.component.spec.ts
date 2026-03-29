import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmUserDialogComponent } from './confirm-user-dialog.component';

describe('ConfirmUserDialogComponent', () => {
    let fixture: ComponentFixture<ConfirmUserDialogComponent>;
    let component: ConfirmUserDialogComponent;
    let dialogRef: { close: jest.Mock };

    beforeEach(async () => {
        dialogRef = { close: jest.fn() };

        await TestBed.configureTestingModule({
            imports: [ConfirmUserDialogComponent],
            providers: [
                provideNoopAnimations(),
                { provide: MAT_DIALOG_DATA, useValue: { email: 'test@example.com' } },
                { provide: MatDialogRef, useValue: dialogRef },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmUserDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debe crearse correctamente', () => {
        expect(component).toBeTruthy();
    });

    it('debe exponer el correo desde los datos del diálogo', () => {
        expect(component.data.email).toBe('test@example.com');
    });

    it('debe cerrar con true al confirmar', () => {
        component.confirm();
        expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('debe cerrar con false al cancelar', () => {
        component.cancel();
        expect(dialogRef.close).toHaveBeenCalledWith(false);
    });
});
