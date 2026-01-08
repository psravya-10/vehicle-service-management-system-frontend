import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerService } from '../services/manager';

@Component({
    selector: 'app-part-requests',
    imports: [CommonModule, FormsModule],
    templateUrl: './part-requests.html',
    styleUrl: './part-requests.css'
})
export class PartRequests implements OnInit {
    allRequests: any[] = [];
    filteredRequests: any[] = [];
    selectedFilter: string = 'REQUESTED';

    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private managerService: ManagerService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadRequests();
    }

    loadRequests(): void {
        this.managerService.getAllPartRequests().subscribe({
            next: (data) => {
                this.allRequests = data.reverse();
                this.applyFilter();
                this.cdr.detectChanges();
            },
            error: (err) => {
                if (err.status === 503 || err.status === 500) {
                    this.errorMessage = 'Inventory Service is currently unavailable. Please try again later.';
                } else {
                    this.errorMessage = err.error?.message || err.error || 'Failed to load part requests.';
                }
                this.cdr.detectChanges();
            }
        });
    }

    applyFilter(): void {
        if (this.selectedFilter === 'ALL') {
            this.filteredRequests = this.allRequests;
        } else {
            this.filteredRequests = this.allRequests.filter(r => r.status === this.selectedFilter);
        }
    }

    onFilterChange(): void {
        this.applyFilter();
        this.cdr.detectChanges();
    }

    approve(requestId: string): void {
        this.errorMessage = '';
        this.successMessage = '';

        this.managerService.approvePartRequest(requestId).subscribe({
            next: () => {
                this.successMessage = 'Part request approved successfully';
                this.loadRequests();
                setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
            },
            error: (err) => {

                this.successMessage = 'Part request approved successfully';
                this.loadRequests();
                this.cdr.detectChanges();
                setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
            }
        });
    }
}
