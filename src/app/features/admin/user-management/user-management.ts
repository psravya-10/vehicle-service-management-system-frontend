import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, StaffMember } from '../services/admin';

@Component({
    selector: 'app-user-management',
    imports: [CommonModule],
    templateUrl: './user-management.html',
    styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
    allUsers: StaffMember[] = [];
    isLoading: boolean = false;

    constructor(
        private adminService: AdminService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.isLoading = true;
        this.adminService.getAllUsers().subscribe({
            next: (data) => {
                // Filter out ADMIN users
                this.allUsers = data.filter(user => user.role !== 'ADMIN');
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.log('Error loading users', err);
                this.isLoading = false;
            }
        });
    }

    getRoleClass(role: string): string {
        return role?.toLowerCase() || '';
    }
}
