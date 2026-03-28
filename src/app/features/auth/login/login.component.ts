import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthToken } from '../../../core/models/api-response.model';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { emailFormatValidator } from '../../../core/validators/email.validator';
import { ConfirmUserDialogComponent } from '../confirm-user-dialog/confirm-user-dialog.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatIconModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly userService = inject(UserService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);

    readonly loading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    readonly form = this.fb.group({
        email: ['', [Validators.required, emailFormatValidator()]],
    });

    constructor() {
        // Redirigir si ya tiene sesion activa
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/tasks']);
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const email = this.form.value.email!;
        this.loading.set(true);
        this.errorMessage.set(null);

        // Buscar si el usuario ya existe antes de intentar registrarlo
        this.userService.findByEmail(email).subscribe({
            next: ({ token, data }) => this.saveAndNavigate(token, data),
            error: (err: HttpErrorResponse) => {
                this.loading.set(false);
                if (err.status === 404) {
                    this.openConfirmDialog(email);
                } else {
                    this.errorMessage.set('Error al verificar el usuario. Intenta de nuevo.');
                }
            },
        });
    }

    private openConfirmDialog(email: string): void {
        // Preguntar al usuario si desea crear una cuenta nueva
        const dialogRef = this.dialog.open(ConfirmUserDialogComponent, {
            data: { email },
            width: '400px',
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (!confirmed) return;

            this.loading.set(true);
            this.userService.create({ email }).subscribe({
                next: ({ token, data }) => this.saveAndNavigate(token, data),
                error: () => {
                    this.loading.set(false);
                    this.errorMessage.set('Error al crear el usuario. Intenta de nuevo.');
                },
            });
        });
    }

    private saveAndNavigate(token: string, user: User): void {
        // Guardar sesion y redirigir a la lista de tareas
        const authToken: AuthToken = { token, userId: user.id, email: user.email };
        this.authService.saveSession(authToken, user);
        this.router.navigate(['/tasks']);
    }
}
