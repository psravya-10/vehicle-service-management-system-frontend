import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerService } from '../services/manager';

@Component({
    selector: 'app-service-bays',
    imports: [CommonModule, FormsModule],
    templateUrl: './service-bays.html',
    styleUrl: './service-bays.css'
})
export class ServiceBays implements OnInit {
    allBays: any[] = [];
    filteredBays: any[] = [];
    selectedFilter: string = 'ALL';

    constructor(
        private managerService: ManagerService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadBays();
    }

    loadBays(): void {
        this.managerService.getAllBays().subscribe({
            next: (data) => {
                this.allBays = data;
                this.applyFilter();
                this.cdr.detectChanges();
            },
            error: (err) => console.log('Error loading bays', err)
        });
    }

    applyFilter(): void {
        if (this.selectedFilter === 'ALL') {
            this.filteredBays = this.allBays;
        } else {
            this.filteredBays = this.allBays.filter(b => b.status === this.selectedFilter);
        }
    }

    onFilterChange(): void {
        this.applyFilter();
        this.cdr.detectChanges();
    }
}

