import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
    title: string;
}

@Component({
    selector: 'app-delete-task-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './delete-task-dialog.component.html',
    styleUrl: './delete-task-dialog.component.scss',
})
export class DeleteTaskDialogComponent {
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<DeleteTaskDialogComponent>);

    confirm(): void {
        this.dialogRef.close(true);
    }

    cancel(): void {
        this.dialogRef.close(false);
    }
}
