import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Valida que el email tenga un formato correcto
export function emailFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        return EMAIL_REGEX.test(control.value) ? null : { emailFormat: true };
    };
}
