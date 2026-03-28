import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss',
})
export class ToastComponent {
    readonly toastService = inject(ToastService);
}
