import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin';

@Component({
    selector: 'app-reports',
    imports: [CommonModule],
    templateUrl: './reports.html',
    styleUrl: './reports.css'
})
export class Reports implements OnInit {
    // Service request stats
    totalRequests: number = 0;
    pendingRequests: number = 0;
    completedRequests: number = 0;
    inProgressRequests: number = 0;

    // Revenue stats
    totalRevenue: number = 0;
    paidRevenue: number = 0;
    unpaidRevenue: number = 0;
    paidInvoices: number = 0;
    pendingInvoices: number = 0;

    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(
        private adminService: AdminService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadAllData();
    }

    loadAllData(): void {
        this.isLoading = true;
        this.loadServiceStats();
        this.loadRevenueStats();
    }

    loadServiceStats(): void {
        this.adminService.getAllServiceRequests().subscribe({
            next: (data) => {
                this.totalRequests = data.length;
                this.pendingRequests = data.filter(r => r.status === 'REQUESTED').length;
                this.inProgressRequests = data.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length;
                this.completedRequests = data.filter(r => r.status === 'COMPLETED' || r.status === 'CLOSED').length;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                if (err.status === 503 || err.status === 500) {
                    this.errorMessage = 'Service Request Service is currently unavailable. Please try again later.';
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadRevenueStats(): void {
        const now = new Date();
        this.adminService.getMonthlyRevenue(now.getFullYear(), now.getMonth() + 1).subscribe({
            next: (invoices) => {
                this.totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
                this.paidRevenue = invoices
                    .filter(i => i.paymentStatus === 'PAID')
                    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
                this.unpaidRevenue = invoices
                    .filter(i => i.paymentStatus === 'PENDING')
                    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
                this.paidInvoices = invoices.filter(i => i.paymentStatus === 'PAID').length;
                this.pendingInvoices = invoices.filter(i => i.paymentStatus === 'PENDING').length;
                this.cdr.detectChanges();
            },
            error: (err) => {
                if (err.status === 503 || err.status === 500) {
                    this.errorMessage = 'Billing Service is currently unavailable. Please try again later.';
                }
                this.cdr.detectChanges();
            }
        });
    }

    getPercentage(value: number, total: number): number {
        return total > 0 ? Math.round((value / total) * 100) : 0;
    }

    getRevenueBarHeight(value: number): number {
        const maxHeight = 150;
        if (this.totalRevenue === 0) return 0;
        return Math.max(20, (value / this.totalRevenue) * maxHeight);
    }
}
