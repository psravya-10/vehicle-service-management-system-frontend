import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerService } from '../services/manager';

@Component({
    selector: 'app-parts-inventory',
    imports: [CommonModule, FormsModule],
    templateUrl: './parts-inventory.html',
    styleUrl: './parts-inventory.css'
})
export class PartsInventory implements OnInit {
    allParts: any[] = [];
    lowStockParts: any[] = [];
    showLowStockOnly: boolean = false;

    selectedPart: any = null;
    restockMode: boolean = false;
    thresholdMode: boolean = false;
    addMode: boolean = false;

    restockQuantity: number = 0;
    newThreshold: number = 0;

    newPart = { name: '', category: '', availableQuantity: 0, unitPrice: 0 };

    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private managerService: ManagerService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadParts();
        this.loadLowStock();
    }

    loadParts(): void {
        this.managerService.getAllParts().subscribe({
            next: (data) => {
                this.allParts = data;
                this.cdr.detectChanges();
            },
            error: (err) => {
                if (err.status === 503 || err.status === 500) {
                    this.errorMessage = 'Inventory Service is currently unavailable. Please try again later.';
                } else {
                    this.errorMessage = err.error?.message || err.error || 'Failed to load parts.';
                }
                this.cdr.detectChanges();
            }
        });
    }

    loadLowStock(): void {
        this.managerService.getLowStockParts().subscribe({
            next: (data) => {
                this.lowStockParts = data;
                this.cdr.detectChanges();
            },
            error: (err) => {
                if (err.status === 503 || err.status === 500) {
                    this.errorMessage = 'Inventory Service is currently unavailable. Please try again later.';
                }
                this.cdr.detectChanges();
            }
        });
    }

    getParts(): any[] {
        return this.showLowStockOnly ? this.lowStockParts : this.allParts;
    }

    openRestock(part: any): void {
        this.selectedPart = part;
        this.restockMode = true;
        this.restockQuantity = 0;
        this.errorMessage = '';
    }

    openThreshold(part: any): void {
        this.selectedPart = part;
        this.thresholdMode = true;
        this.newThreshold = part.lowStockThreshold;
        this.errorMessage = '';
    }

    openAdd(): void {
        this.addMode = true;
        this.newPart = { name: '', category: '', availableQuantity: 0, unitPrice: 0 };
        this.errorMessage = '';
    }

    restock(): void {
        if (this.restockQuantity <= 0) {
            this.errorMessage = 'Quantity must be greater than 0';
            return;
        }

        this.managerService.restockPart(this.selectedPart.id, this.restockQuantity).subscribe({
            next: () => {
                this.successMessage = 'Part restocked successfully';
                this.cancel();
                this.loadParts();
                this.loadLowStock();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to restock';
                this.cdr.detectChanges();
            }
        });
    }

    updateThreshold(): void {
        if (this.newThreshold < 0) {
            this.errorMessage = 'Threshold cannot be negative';
            return;
        }

        this.managerService.updateThreshold(this.selectedPart.id, this.newThreshold).subscribe({
            next: () => {
                this.successMessage = 'Threshold updated successfully';
                this.cancel();
                this.loadParts();
                this.loadLowStock();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to update threshold';
                this.cdr.detectChanges();
            }
        });
    }

    addPart(): void {
        if (!this.newPart.name || !this.newPart.category) {
            this.errorMessage = 'Name and category are required';
            return;
        }

        this.managerService.addPart(
            this.newPart.name,
            this.newPart.category,
            this.newPart.availableQuantity,
            this.newPart.unitPrice
        ).subscribe({
            next: () => {
                this.successMessage = 'Part added successfully';
                this.cancel();
                this.loadParts();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to add part';
                this.cdr.detectChanges();
            }
        });
    }

    cancel(): void {
        this.selectedPart = null;
        this.restockMode = false;
        this.thresholdMode = false;
        this.addMode = false;
        this.errorMessage = '';
    }
}
