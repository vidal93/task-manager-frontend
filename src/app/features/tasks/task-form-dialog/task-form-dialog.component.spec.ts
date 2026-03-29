import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TaskFormDialogComponent } from './task-form-dialog.component';
import { Task } from '../../../core/models/task.model';

const mockTask: Task = {
    id: 'task-1',
    title: 'Tarea existente',
    description: 'Descripcion existente',
    completed: false,
    userId: 'user-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('TaskFormDialogComponent', () => {
    let fixture: ComponentFixture<TaskFormDialogComponent>;
    let component: TaskFormDialogComponent;
    let dialogRef: { close: jest.Mock };

    const setup = async (task?: Task) => {
        dialogRef = { close: jest.fn() };

        await TestBed.configureTestingModule({
            imports: [TaskFormDialogComponent],
            providers: [
                provideNoopAnimations(),
                { provide: MAT_DIALOG_DATA, useValue: { task } },
                { provide: MatDialogRef, useValue: dialogRef },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TaskFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    describe('modo crear', () => {
        beforeEach(() => setup());

        it('debe crearse correctamente', () => {
            expect(component).toBeTruthy();
        });

        it('debe tener isEditing en false', () => {
            expect(component.isEditing).toBe(false);
        });

        it('debe tener los campos del formulario vacíos', () => {
            expect(component.form.value.title).toBe('');
            expect(component.form.value.description).toBe('');
        });

        it('debe tener el formulario inválido cuando el título está vacío', () => {
            expect(component.form.invalid).toBe(true);
        });

        it('no debe cerrar cuando el formulario es inválido', () => {
            component.submit();
            expect(dialogRef.close).not.toHaveBeenCalled();
        });

        it('debe cerrar con el DTO cuando el formulario es válido', () => {
            component.form.setValue({ title: 'Nueva tarea', description: 'Desc' });
            component.submit();
            expect(dialogRef.close).toHaveBeenCalledWith({
                title: 'Nueva tarea',
                description: 'Desc',
            });
        });

        it('debe cerrar sin valor al cancelar', () => {
            component.cancel();
            expect(dialogRef.close).toHaveBeenCalledWith();
        });
    });

    describe('modo editar', () => {
        beforeEach(() => setup(mockTask));

        it('debe tener isEditing en true', () => {
            expect(component.isEditing).toBe(true);
        });

        it('debe prellenar el formulario con los datos de la tarea', () => {
            expect(component.form.value.title).toBe(mockTask.title);
            expect(component.form.value.description).toBe(mockTask.description);
        });

        it('debe cerrar con el DTO actualizado al enviar', () => {
            component.form.setValue({ title: 'Titulo editado', description: 'Nueva desc' });
            component.submit();
            expect(dialogRef.close).toHaveBeenCalledWith({
                title: 'Titulo editado',
                description: 'Nueva desc',
            });
        });
    });
});
