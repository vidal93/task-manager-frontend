import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CreateTaskDto, Task, UpdateTaskDto } from '../../../core/models/task.model';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { ToastService } from '../../../core/services/toast.service';
import { DeleteTaskDialogComponent } from '../delete-task-dialog/delete-task-dialog.component';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [
        DatePipe,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatToolbarModule,
        MatTabsModule,
    ],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
    private readonly taskService = inject(TaskService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly toast = inject(ToastService);

    readonly tasks = signal<Task[]>([]);
    readonly loading = signal(true);
    readonly loadError = signal(false);
    readonly currentUser = this.authService.currentUser;

    // Filtra las tareas segun su estado para mostrarlas en pestañas separadas
    readonly pendingTasks = computed(() => this.tasks().filter((t) => !t.completed));
    readonly completedTasks = computed(() => this.tasks().filter((t) => t.completed));

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.loading.set(true);
        this.loadError.set(false);
        this.taskService.getAll().subscribe({
            next: (response) => {
                this.tasks.set(response.data);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.loadError.set(true);
            },
        });
    }

    openCreateDialog(): void {
        const ref = this.dialog.open(TaskFormDialogComponent, {
            width: '480px',
            data: {},
        });

        // Agregar la nueva tarea al inicio de la lista sin recargar
        ref.afterClosed().subscribe((dto: CreateTaskDto | undefined) => {
            if (!dto) return;
            this.taskService.create(dto).subscribe({
                next: (response) => {
                    this.tasks.update((list) => [response.data, ...list]);
                    this.toast.success('Tarea creada correctamente');
                },
                error: () => {
                    this.toast.error('Error al crear la tarea');
                },
            });
        });
    }

    openEditDialog(task: Task): void {
        const ref = this.dialog.open(TaskFormDialogComponent, {
            width: '480px',
            data: { task },
        });

        // Reemplazar la tarea editada en la lista local
        ref.afterClosed().subscribe((dto: UpdateTaskDto | undefined) => {
            if (!dto) return;
            this.taskService.update(task.id, dto).subscribe({
                next: (response) => {
                    this.tasks.update((list) => list.map((t) => (t.id === task.id ? response.data : t)));
                    this.toast.success('Tarea actualizada correctamente');
                },
                error: () => {
                    this.toast.error('Error al actualizar la tarea');
                },
            });
        });
    }

    toggleComplete(task: Task): void {
        // Cambiar el estado de completado sin abrir un dialogo
        this.taskService.update(task.id, { completed: !task.completed }).subscribe({
            next: (response) => {
                this.tasks.update((list) => list.map((t) => (t.id === task.id ? response.data : t)));
            },
            error: () => {
                this.toast.error('Error al actualizar la tarea');
            },
        });
    }

    openDeleteDialog(task: Task): void {
        const ref = this.dialog.open(DeleteTaskDialogComponent, {
            width: '400px',
            data: { title: task.title },
        });

        // Eliminar la tarea de la lista local si el usuario confirma
        ref.afterClosed().subscribe((confirmed: boolean) => {
            if (!confirmed) return;
            this.taskService.delete(task.id).subscribe({
                next: () => {
                    this.tasks.update((list) => list.filter((t) => t.id !== task.id));
                    this.toast.success(`Tarea "${task.title}" eliminada`);
                },
                error: () => {
                    this.toast.error('Error al eliminar la tarea');
                },
            });
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth']);
    }
}
