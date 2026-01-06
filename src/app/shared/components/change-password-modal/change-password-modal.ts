import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
    selector: 'app-change-password-modal',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './change-password-modal.html',
    styleUrl: './change-password-modal.css'
})
export class ChangePasswordModal {
    @Output() closed = new EventEmitter<void>();
    @Output() passwordChanged = new EventEmitter<void>();

    form: FormGroup;
    isLoading = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) {
        this.form = this.fb.group({
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            ]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    get passwordsMatch(): boolean {
        return this.form.get('newPassword')?.value === this.form.get('confirmPassword')?.value;
    }

    onSubmit(): void {
        if (this.form.invalid || !this.passwordsMatch) {
            this.form.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.changePassword(
            this.form.get('currentPassword')?.value,
            this.form.get('newPassword')?.value
        ).subscribe({
            next: () => {
                this.isLoading = false;
                this.successMessage = 'Password changed successfully. Logging out...';
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.passwordChanged.emit();
                }, 1500);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.message || 'Failed to change password';
                this.cdr.detectChanges();
            }
        });
    }

    onClose(): void {
        this.closed.emit();
    }

    onOverlayClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
            this.onClose();
        }
    }
}
