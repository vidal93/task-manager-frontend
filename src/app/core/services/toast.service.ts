import { Injectable, signal } from '@angular/core';

import { Toast } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
    readonly toasts = signal<Toast[]>([]);

    // Agrega un toast a la lista y lo elimina automaticamente despues de 3.5s
    private show(message: string, type: Toast['type']): void {
        const id = Date.now();
        this.toasts.update((list) => [...list, { id, message, type }]);
        setTimeout(() => this.dismiss(id), 3500);
    }

    // Muestra un toast de exito
    success(message: string): void {
        this.show(message, 'success');
    }

    // Muestra un toast de error
    error(message: string): void {
        this.show(message, 'error');
    }

    // Elimina un toast de la lista por su id
    dismiss(id: number): void {
        this.toasts.update((list) => list.filter((t) => t.id !== id));
    }
}
