import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';

import { CreateTaskDto, Task, UpdateTaskDto } from '../../../core/models/task.model';

interface DialogData {
    task?: Task;
}

@Component({
    selector: 'app-task-form-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        TextFieldModule,
    ],
    templateUrl: './task-form-dialog.component.html',
    styleUrl: './task-form-dialog.component.scss',
})
export class TaskFormDialogComponent {
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    private readonly fb = inject(FormBuilder);
    private readonly dialogRef = inject(MatDialogRef<TaskFormDialogComponent>);

    // Determina si el dialogo es para editar o crear una tarea
    readonly isEditing = !!this.data?.task;

    readonly form = this.fb.group({
        title: [this.data?.task?.title ?? '', [Validators.required, Validators.maxLength(100)]],
        description: [this.data?.task?.description ?? '', [Validators.maxLength(500)]],
    });

    submit(): void {
        if (this.form.invalid) return;
        const dto: CreateTaskDto | UpdateTaskDto = {
            title: this.form.value.title!,
            description: this.form.value.description ?? '',
        };
        this.dialogRef.close(dto);
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
