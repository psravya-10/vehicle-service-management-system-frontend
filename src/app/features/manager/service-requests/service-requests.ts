import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerService } from '../services/manager';
import { forkJoin } from 'rxjs';

interface TechnicianWithWorkload {
    id: string;
    name: string;
    workload: number;
}

@Component({
    selector: 'app-service-requests',
    imports: [CommonModule, FormsModule],
    templateUrl: './service-requests.html',
    styleUrl: './service-requests.css'
})
export class ServiceRequests implements OnInit {
    allRequests: any[] = [];
    filteredRequests: any[] = [];
    selectedFilter: string = 'ALL';

    technicians: TechnicianWithWorkload[] = [];
    bays: any[] = [];

    selectedRequest: any = null;
    assignMode: boolean = false;
    closeMode: boolean = false;

    selectedTechnicianId: string = '';
    selectedBayId: string = '';
    labourCharges: number = 0;

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
        this.managerService.getAllServiceRequests().subscribe({
            next: (data) => {
                this.allRequests = data.reverse();
                this.applyFilter();
                this.cdr.detectChanges();
            },
            error: (err) => {
                if (err.status === 503 || err.status === 500) {
                    this.errorMessage = 'Service Request Service is currently unavailable. Please try again later.';
                } else {
                    this.errorMessage = err.error?.message || err.error || 'Failed to load service requests.';
                }
                this.cdr.detectChanges();
            }
        });
    }

    applyFilter(): void {
        if (this.selectedFilter === 'ALL') {
            this.filteredRequests = this.allRequests;
        } else if (this.selectedFilter === 'PENDING') {
            this.filteredRequests = this.allRequests.filter(r => r.status === 'REQUESTED');
        } else {
            this.filteredRequests = this.allRequests.filter(r => r.status === this.selectedFilter);
        }
    }

    onFilterChange(): void {
        this.applyFilter();
        this.cdr.detectChanges();
    }

    openAssign(request: any): void {
        this.selectedRequest = request;
        this.assignMode = true;
        this.closeMode = false;
        this.errorMessage = '';
        this.successMessage = '';

        // Load all technicians with workload
        forkJoin({
            technicians: this.managerService.getAllTechnicians(),
            workload: this.managerService.getTechnicianWorkload()
        }).subscribe({
            next: ({ technicians, workload }) => {
                // Combine technicians with workload and sort by workload ascending
                this.technicians = technicians.map((tech: any) => ({
                    id: tech.id,
                    name: tech.name,
                    workload: workload[tech.id] || 0
                })).sort((a: TechnicianWithWorkload, b: TechnicianWithWorkload) => a.workload - b.workload);
                this.cdr.detectChanges();
            },
            error: (err) => {
                if (err.status === 503 || err.status === 500) {
                    this.errorMessage = 'User Service is currently unavailable. Please try again later.';
                } else {
                    this.errorMessage = err.error?.message || err.error || 'Failed to load technicians.';
                }
                this.cdr.detectChanges();
            }
        });

        // Load only available bays
        this.managerService.getAvailableBays().subscribe({
            next: (data) => { this.bays = data; this.cdr.detectChanges(); },
            error: (err) => {
                if (err.status === 503 || err.status === 500) {
                    this.errorMessage = 'Service Request Service is currently unavailable. Please try again later.';
                }
                this.cdr.detectChanges();
            }
        });
    }

    openClose(request: any): void {
        this.selectedRequest = request;
        this.closeMode = true;
        this.assignMode = false;
        this.errorMessage = '';
        this.successMessage = '';
        this.labourCharges = 0;
    }

    assign(): void {
        if (!this.selectedTechnicianId || !this.selectedBayId) {
            this.errorMessage = 'Please select technician and bay';
            return;
        }

        this.managerService.assignServiceRequest(
            this.selectedRequest.id,
            this.selectedTechnicianId,
            this.selectedBayId
        ).subscribe({
            next: () => {
                this.successMessage = 'Service request assigned successfully';
                this.cancel();
                this.loadRequests();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to assign';
                this.cdr.detectChanges();
            }
        });
    }

    close(): void {
        if (this.labourCharges <= 0) {
            this.errorMessage = 'Labour charges must be greater than 0';
            return;
        }

        this.managerService.closeServiceRequest(this.selectedRequest.id, this.labourCharges).subscribe({
            next: () => {
                this.successMessage = 'Service closed successfully';
                this.cancel();
                this.loadRequests();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to close service';
                this.cdr.detectChanges();
            }
        });
    }

    cancel(): void {
        this.selectedRequest = null;
        this.assignMode = false;
        this.closeMode = false;
        this.selectedTechnicianId = '';
        this.selectedBayId = '';
        this.labourCharges = 0;
        this.errorMessage = '';
    }
}
