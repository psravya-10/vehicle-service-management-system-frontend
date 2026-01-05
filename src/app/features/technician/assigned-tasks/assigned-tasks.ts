import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechnicianService } from '../services/technician';

@Component({
    selector: 'app-assigned-tasks',
    imports: [CommonModule, FormsModule],
    templateUrl: './assigned-tasks.html',
    styleUrl: './assigned-tasks.css'
})
export class AssignedTasks implements OnInit {
    allTasks: any[] = [];
    filteredTasks: any[] = [];
    selectedFilter: string = 'ALL';

    constructor(
        private technicianService: TechnicianService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.technicianService.getMyAssignedTasks().subscribe({
            next: (data) => {
                this.allTasks = data.reverse();
                this.applyFilter();
                this.cdr.detectChanges();
            },
            error: (err) => console.log('Error loading tasks', err)
        });
    }

    applyFilter(): void {
        if (this.selectedFilter === 'ALL') {
            this.filteredTasks = this.allTasks;
        } else {
            this.filteredTasks = this.allTasks.filter(t => t.status === this.selectedFilter);
        }
    }

    onFilterChange(): void {
        this.applyFilter();
        this.cdr.detectChanges();
    }
}

