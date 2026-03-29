import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DeleteTaskDialogComponent } from './delete-task-dialog.component';

describe('DeleteTaskDialogComponent', () => {
    let fixture: ComponentFixture<DeleteTaskDialogComponent>;
    let component: DeleteTaskDialogComponent;
    let dialogRef: { close: jest.Mock };

    beforeEach(async () => {
        dialogRef = { close: jest.fn() };

        await TestBed.configureTestingModule({
            imports: [DeleteTaskDialogComponent],
            providers: [
                provideNoopAnimations(),
                { provide: MAT_DIALOG_DATA, useValue: { title: 'Tarea de prueba' } },
                { provide: MatDialogRef, useValue: dialogRef },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeleteTaskDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debe crearse correctamente', () => {
        expect(component).toBeTruthy();
    });

    it('debe exponer el título de la tarea desde los datos del diálogo', () => {
        expect(component.data.title).toBe('Tarea de prueba');
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
