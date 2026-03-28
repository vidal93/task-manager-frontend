import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CreateTaskDto, Task, UpdateTaskDto } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/tasks`;

    // Obtiene todas las tareas del usuario autenticado
    getAll(): Observable<ApiResponse<Task[]>> {
        return this.http.get<ApiResponse<Task[]>>(this.apiUrl);
    }

    // Crea una nueva tarea con título y descripción
    create(dto: CreateTaskDto): Observable<ApiResponse<Task>> {
        return this.http.post<ApiResponse<Task>>(this.apiUrl, dto);
    }

    // Actualiza los datos de una tarea existente por su id
    update(id: string, dto: UpdateTaskDto): Observable<ApiResponse<Task>> {
        return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, dto);
    }

    // Elimina una tarea por su id
    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
