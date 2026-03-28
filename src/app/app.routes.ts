import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

// Lazy loading en todas las rutas para reducir el bundle inicial
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadComponent: () =>
            import('./features/auth/login/login.component').then(
                (m) => m.LoginComponent,
            ),
    },
    {
        // authGuard redirige a /auth si no hay sesion activa
        path: 'tasks',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/tasks/task-list/task-list.component').then(
                (m) => m.TaskListComponent,
            ),
    },
    {
        path: '**',
        redirectTo: 'auth',
    },
];
