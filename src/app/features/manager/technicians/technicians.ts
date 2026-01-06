import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerService } from '../services/manager';

@Component({
    selector: 'app-technicians',
    imports: [CommonModule, FormsModule],
    templateUrl: './technicians.html',
    styleUrl: './technicians.css'
})
export class Technicians implements OnInit {
    allTechnicians: any[] = [];
    filteredTechnicians: any[] = [];
    workload: { [key: string]: number } = {};
    selectedFilter: string = 'ALL';
    errorMessage: string = '';

    constructor(
        private managerService: ManagerService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadTechnicians();
        this.loadWorkload();
    }

    loadTechnicians(): void {
        this.errorMessage = '';
        this.managerService.getAllTechnicians().subscribe({
            next: (data) => {
                this.allTechnicians = data;
                this.applyFilter();
                this.cdr.detectChanges();
            },
            error: (err) => {
                if (err.status === 503 || err.status === 500) {
                    this.errorMessage = 'User Service is currently unavailable. Please try again later.';
                } else if (typeof err.error === 'string') {
                    this.errorMessage = err.error;
                } else if (err.error?.message) {
                    this.errorMessage = err.error.message;
                } else {
                    this.errorMessage = 'Failed to load technicians. Please try again later.';
                }
                this.cdr.detectChanges();
            }
        });
    }

    loadWorkload(): void {
        this.managerService.getTechnicianWorkload().subscribe({
            next: (data) => {
                this.workload = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.log('Error loading workload', err)
        });
    }

    applyFilter(): void {
        if (this.selectedFilter === 'ALL') {
            this.filteredTechnicians = this.allTechnicians;
        } else {
            this.filteredTechnicians = this.allTechnicians.filter(t => t.availability === this.selectedFilter);
        }
    }

    onFilterChange(): void {
        this.applyFilter();
        this.cdr.detectChanges();
    }

    getWorkload(techId: string): number {
        return this.workload[techId] || 0;
    }
}

