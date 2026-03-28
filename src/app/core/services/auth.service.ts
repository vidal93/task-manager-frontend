import { Injectable, computed, signal } from '@angular/core';

import { AuthToken } from '../models/api-response.model';
import { User } from '../models/user.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
    private readonly _user = signal<User | null>(this.loadUser());

    // Estado reactivo de autenticacion
    readonly isAuthenticated = computed(() => !!this._token());
    readonly currentUser = this._user.asReadonly();

    saveSession(authToken: AuthToken, user: User): void {
        localStorage.setItem(TOKEN_KEY, authToken.token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this._token.set(authToken.token);
        this._user.set(user);
    }

    getToken(): string | null {
        return this._token();
    }

    getUserId(): string | null {
        return this._user()?.id ?? null;
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this._token.set(null);
        this._user.set(null);
    }

    // Recupera el usuario del localStorage al inicializar el servicio
    private loadUser(): User | null {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? (JSON.parse(stored) as User) : null;
    }
}
