import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, StaffMember } from '../services/admin';

@Component({
    selector: 'app-staff-management',
    imports: [CommonModule, FormsModule],
    templateUrl: './staff-management.html',
    styleUrl: './staff-management.css'
})
export class StaffManagement implements OnInit {
    allStaff: StaffMember[] = [];
    selectedStatusFilter: string = 'ALL';
    selectedRoleFilter: string = 'ALL';

    selectedStaff: StaffMember | null = null;
    showModal: boolean = false;
    isLoading: boolean = false;

    constructor(
        private adminService: AdminService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadStaff();
    }

    loadStaff(): void {
        this.isLoading = true;
        const status = this.selectedStatusFilter === 'ALL' ? undefined : this.selectedStatusFilter;
        const role = this.selectedRoleFilter === 'ALL' ? undefined : this.selectedRoleFilter;

        this.adminService.getAllStaff(status, role).subscribe({
            next: (data) => {
                this.allStaff = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.log('Error loading staff', err);
                this.isLoading = false;
            }
        });
    }

    onFilterChange(): void {
        this.loadStaff();
    }

    viewDetails(staff: StaffMember): void {
        this.selectedStaff = staff;
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.selectedStaff = null;
    }

    approveStaff(): void {
        if (!this.selectedStaff) return;

        this.adminService.updateApproval(this.selectedStaff.id, true).subscribe({
            next: () => {
                this.closeModal();
                this.loadStaff();
            },
            error: (err) => console.log('Error approving staff', err)
        });
    }

    rejectStaff(): void {
        if (!this.selectedStaff) return;

        this.adminService.updateApproval(this.selectedStaff.id, false).subscribe({
            next: () => {
                this.closeModal();
                this.loadStaff();
            },
            error: (err) => console.log('Error rejecting staff', err)
        });
    }

    getStatusClass(status: string): string {
        return status?.toLowerCase() || '';
    }
}
