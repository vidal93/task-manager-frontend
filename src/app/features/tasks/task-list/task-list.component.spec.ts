import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { Task } from '../../../core/models/task.model';

const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
};

const mockTask: Task = {
    id: 'task-1',
    title: 'Tarea de prueba',
    description: 'Descripcion',
    completed: false,
    userId: 'user-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('TaskListComponent', () => {
    let fixture: ComponentFixture<TaskListComponent>;
    let component: TaskListComponent;
    let authService: AuthService;
    let taskService: {
        getAll: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
    let router: { navigate: jest.Mock };
    let dialog: { open: jest.Mock };

    beforeEach(async () => {
        localStorage.clear();

        taskService = {
            getAll: jest.fn().mockReturnValue(of({ data: [] })),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        router = { navigate: jest.fn() };
        dialog = { open: jest.fn() };

        await TestBed.configureTestingModule({
            imports: [TaskListComponent],
            providers: [
                provideNoopAnimations(),
                { provide: TaskService, useValue: taskService },
                { provide: Router, useValue: router },
                { provide: MatDialog, useValue: dialog },
            ],
        }).compileComponents();

        authService = TestBed.inject(AuthService);
        authService.saveSession(
            { token: 'valid-token', userId: 'user-1', email: 'test@example.com' },
            mockUser,
        );

        fixture = TestBed.createComponent(TaskListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => localStorage.clear());

    it('debe crearse correctamente', () => {
        expect(component).toBeTruthy();
    });

    it('debe llamar a getAll al inicializar', () => {
        expect(taskService.getAll).toHaveBeenCalled();
    });

    it('debe poblar las tareas después de cargar', () => {
        taskService.getAll.mockReturnValue(of({ data: [mockTask] }));
        component.loadTasks();
        expect(component.tasks()).toHaveLength(1);
    });

    it('debe separar las tareas pendientes y completadas', () => {
        const completedTask = { ...mockTask, id: 'task-2', completed: true };
        taskService.getAll.mockReturnValue(of({ data: [mockTask, completedTask] }));
        component.loadTasks();
        expect(component.pendingTasks()).toHaveLength(1);
        expect(component.completedTasks()).toHaveLength(1);
    });

    it('debe cerrar sesión y navegar a /auth', () => {
        const logoutSpy = jest.spyOn(authService, 'logout');
        component.logout();
        expect(logoutSpy).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });

    it('debe agregar la nueva tarea a la lista después de crearla', () => {
        taskService.create.mockReturnValue(of({ data: mockTask }));
        dialog.open.mockReturnValue({ afterClosed: () => of({ title: 'Nueva', description: '' }) });
        component.openCreateDialog();
        expect(component.tasks()).toContain(mockTask);
    });

    it('debe eliminar la tarea de la lista después de borrarla', () => {
        taskService.getAll.mockReturnValue(of({ data: [mockTask] }));
        component.loadTasks();
        taskService.delete.mockReturnValue(of(undefined));
        dialog.open.mockReturnValue({ afterClosed: () => of(true) });
        component.openDeleteDialog(mockTask);
        expect(component.tasks().find((t) => t.id === mockTask.id)).toBeUndefined();
    });
});
