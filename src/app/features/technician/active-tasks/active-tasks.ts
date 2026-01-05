import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechnicianService } from '../services/technician';

@Component({
    selector: 'app-active-tasks',
    imports: [CommonModule, FormsModule],
    templateUrl: './active-tasks.html',
    styleUrl: './active-tasks.css'
})
export class ActiveTasks implements OnInit {
    tasks: any[] = [];
    selectedTask: any = null;
    selectedStatus: string = '';
    remarks: string = '';
    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private technicianService: TechnicianService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadActiveTasks();
    }

    loadActiveTasks(): void {
        this.technicianService.getMyAssignedTasks().subscribe({
            next: (data) => {

                this.tasks = data.filter(t =>
                    t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS'
                ).reverse();
                this.cdr.detectChanges();
            },
            error: (err) => console.log('Error loading tasks', err)
        });
    }

    selectTask(task: any): void {
        this.selectedTask = task;
        this.selectedStatus = task.status;
        this.remarks = task.remarks || '';
        this.errorMessage = '';
        this.successMessage = '';
    }

    updateStatus(): void {
        if (!this.selectedTask || !this.selectedStatus) return;

        this.errorMessage = '';
        this.successMessage = '';

        this.technicianService.updateStatus(
            this.selectedTask.id,
            this.selectedStatus,
            this.remarks
        ).subscribe({
            next: () => {
                this.successMessage = 'Status updated successfully!';
                this.loadActiveTasks();
                this.selectedTask = null;
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.successMessage = '';
                    this.cdr.detectChanges();
                }, 3000);
            },
            error: (err) => {
                this.errorMessage = err.error?.message || err.error || 'Failed to update status';
                this.cdr.detectChanges();
            }
        });
    }

    cancelEdit(): void {
        this.selectedTask = null;
        this.errorMessage = '';
        this.successMessage = '';
    }
}
