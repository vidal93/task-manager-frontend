import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaskService } from './task.service';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/tasks`;

const mockTask: Task = {
    id: 'task-1',
    title: 'Tarea de prueba',
    description: 'Descripción de la tarea',
    completed: false,
    userId: 'user-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('TaskService', () => {
    let service: TaskService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(TaskService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('debe crearse correctamente', () => {
        expect(service).toBeTruthy();
    });

    describe('getAll', () => {
        it('debe obtener todas las tareas y retornar ApiResponse', () => {
            const mockResponse: ApiResponse<Task[]> = { data: [mockTask] };

            service.getAll().subscribe((response) => {
                expect(response.data.length).toBe(1);
                expect(response.data[0]).toEqual(mockTask);
            });

            const req = httpMock.expectOne(API_URL);
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('create', () => {
        it('debe crear una nueva tarea y retornar ApiResponse', () => {
            const dto: CreateTaskDto = { title: 'Nueva tarea', description: 'Descripción' };
            const mockResponse: ApiResponse<Task> = { data: mockTask };

            service.create(dto).subscribe((response) => {
                expect(response.data).toEqual(mockTask);
            });

            const req = httpMock.expectOne(API_URL);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(dto);
            req.flush(mockResponse);
        });
    });

    describe('update', () => {
        it('debe actualizar la tarea y retornar ApiResponse', () => {
            const dto: UpdateTaskDto = { completed: true };
            const updatedTask: Task = { ...mockTask, completed: true };
            const mockResponse: ApiResponse<Task> = { data: updatedTask };

            service.update('task-1', dto).subscribe((response) => {
                expect(response.data.completed).toBe(true);
            });

            const req = httpMock.expectOne(`${API_URL}/task-1`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(dto);
            req.flush(mockResponse);
        });
    });

    describe('delete', () => {
        it('debe eliminar una tarea por id', () => {
            service.delete('task-1').subscribe((response) => {
                expect(response).toBeUndefined();
            });

            const req = httpMock.expectOne(`${API_URL}/task-1`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });
    });
});
