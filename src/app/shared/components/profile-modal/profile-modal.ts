import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
    selector: 'app-profile-modal',
    imports: [CommonModule],
    templateUrl: './profile-modal.html',
    styleUrl: './profile-modal.css'
})
export class ProfileModal implements OnInit {
    @Output() closed = new EventEmitter<void>();

    userName: string = '';
    userEmail: string = '';
    userRole: string = '';
    isLoading: boolean = true;
    errorMessage: string = '';

    constructor(
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadUserProfile();
    }

    loadUserProfile(): void {
        this.authService.getUserProfile().subscribe({
            next: (profile) => {
                this.userName = profile.name || '';
                this.userEmail = profile.email || '';
                this.userRole = profile.role || '';
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.errorMessage = 'Failed to load profile';
                this.isLoading = false;
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
