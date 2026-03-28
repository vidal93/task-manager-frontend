import { Routes } from '@angular/router';

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
        path: '**',
        redirectTo: 'auth',
    },
];
