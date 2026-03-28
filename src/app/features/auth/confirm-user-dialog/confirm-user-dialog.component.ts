import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
    email: string;
}

@Component({
    selector: 'app-confirm-user-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './confirm-user-dialog.component.html',
    styleUrl: './confirm-user-dialog.component.scss',
})
export class ConfirmUserDialogComponent {
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<ConfirmUserDialogComponent>);

    // Confirmar creacion de cuenta
    confirm(): void {
        this.dialogRef.close(true);
    }

    // Cancelar y cerrar el dialogo
    cancel(): void {
        this.dialogRef.close(false);
    }
}
