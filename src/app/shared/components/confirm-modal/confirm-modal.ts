import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-modal',
    imports: [CommonModule],
    templateUrl: './confirm-modal.html',
    styleUrl: './confirm-modal.css'
})
export class ConfirmModal {
    @Input() title: string = 'Confirm';
    @Input() message: string = 'Are you sure?';
    @Input() confirmText: string = 'Yes';
    @Input() cancelText: string = 'Cancel';
    @Input() confirmButtonClass: string = 'btn-danger';

    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    onConfirm(): void {
        this.confirmed.emit();
    }

    onCancel(): void {
        this.cancelled.emit();
    }

    onOverlayClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
            this.onCancel();
        }
    }
}
