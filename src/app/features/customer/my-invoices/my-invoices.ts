import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingService, Invoice } from '../services/billing';
import { VehicleService } from '../services/vehicle';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface InvoiceWithVehicle extends Invoice {
    vehicleRegNumber?: string;
}

@Component({
    selector: 'app-my-invoices',
    imports: [CommonModule],
    templateUrl: './my-invoices.html',
    styleUrl: './my-invoices.css'
})
export class MyInvoices implements OnInit {
    invoices: InvoiceWithVehicle[] = [];
    selectedInvoice: InvoiceWithVehicle | null = null;
    showModal: boolean = false;
    isLoading: boolean = false;

    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private billingService: BillingService,
        private vehicleService: VehicleService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadInvoices();
    }

    loadInvoices(): void {
        this.isLoading = true;
        this.billingService.getMyInvoices().subscribe({
            next: (data) => {
                this.invoices = data;
                // Fetch vehicle registration numbers
                this.loadVehicleDetails();
            },
            error: (err) => {
                if (err.status === 503 || err.status === 500) {
                    this.errorMessage = 'Billing Service is currently unavailable. Please try again later.';
                } else {
                    this.errorMessage = err.error?.message || err.error || 'Failed to load invoices.';
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadVehicleDetails(): void {
        if (this.invoices.length === 0) {
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
        }

        // Get unique vehicle IDs
        const vehicleIds = [...new Set(this.invoices.map(inv => inv.vehicleId).filter(id => id))];

        if (vehicleIds.length === 0) {
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
        }

        const vehicleRequests = vehicleIds.map(id =>
            this.vehicleService.getVehicleById(id).pipe(
                catchError(() => of({ id, registrationNumber: id }))
            )
        );

        forkJoin(vehicleRequests).subscribe({
            next: (vehicles) => {
                const vehicleMap = new Map<string, string>();
                vehicles.forEach((v: any) => {
                    if (v && v.id) {
                        vehicleMap.set(v.id, v.registrationNumber || v.id);
                    }
                });

                this.invoices = this.invoices.map(inv => ({
                    ...inv,
                    vehicleRegNumber: vehicleMap.get(inv.vehicleId) || inv.vehicleId || 'N/A'
                }));

                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.log('Error loading vehicles', err);
                // Still show invoices with vehicle ID as fallback
                this.invoices = this.invoices.map(inv => ({
                    ...inv,
                    vehicleRegNumber: inv.vehicleId || 'N/A'
                }));
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    viewDetails(invoice: InvoiceWithVehicle): void {
        this.selectedInvoice = invoice;
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.selectedInvoice = null;
    }

    payInvoice(invoice: InvoiceWithVehicle): void {
        this.billingService.payInvoice(invoice.id).subscribe({
            next: () => {
                this.successMessage = 'Payment successful!';
                this.closeModal();
                this.loadInvoices();
                setTimeout(() => this.successMessage = '', 2000);
            },
            error: (err) => {
                console.log('Payment error', err);
                // Check if it actually succeeded (status 200)
                if (err.status === 200) {
                    this.successMessage = 'Payment successful!';
                    this.closeModal();
                    this.loadInvoices();
                    setTimeout(() => this.successMessage = '', 3000);
                } else {
                    this.errorMessage = 'Payment failed. Please try again.';
                    setTimeout(() => this.errorMessage = '', 3000);
                }
            }
        });
    }

    formatDate(dateString: string): string {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
}
