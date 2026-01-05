import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechnicianService } from '../services/technician';
import { InventoryService } from '../services/inventory';

@Component({
    selector: 'app-parts-request',
    imports: [CommonModule, FormsModule],
    templateUrl: './parts-request.html',
    styleUrl: './parts-request.css'
})
export class PartsRequest implements OnInit {
    tasks: any[] = [];
    parts: any[] = [];

    selectedTaskId: string = '';
    selectedPartId: string = '';
    quantity: number = 1;

    errorMessage: string = '';
    successMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private technicianService: TechnicianService,
        private inventoryService: InventoryService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadActiveTasks();
        this.loadParts();
    }

    loadActiveTasks(): void {
        this.technicianService.getMyAssignedTasks().subscribe({
            next: (data) => {
                this.tasks = data.filter(t =>
                    t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS'
                );
                this.cdr.detectChanges();
            },
            error: (err) => console.log('Error loading tasks', err)
        });
    }

    loadParts(): void {
        this.inventoryService.getAllParts().subscribe({
            next: (data) => {
                this.parts = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.log('Error loading parts', err)
        });
    }

    requestPart(): void {
        if (!this.selectedTaskId || !this.selectedPartId || this.quantity < 1) {
            this.errorMessage = 'Please select a task, part, and valid quantity';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.inventoryService.requestPart(
            this.selectedTaskId,
            this.selectedPartId,
            this.quantity
        ).subscribe({
            next: () => {
                this.successMessage = 'Part request submitted successfully! Waiting for manager approval.';
                this.isLoading = false;
                this.resetForm();
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.message || 'Failed to request part';
                this.cdr.detectChanges();
            }
        });
    }

    resetForm(): void {
        this.selectedTaskId = '';
        this.selectedPartId = '';
        this.quantity = 1;
    }

    getSelectedPart(): any {
        return this.parts.find(p => p.id === this.selectedPartId);
    }
}
