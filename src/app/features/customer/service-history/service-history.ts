import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServiceRequestService } from '../services/service-request';

@Component({
  selector: 'app-service-history',
  imports: [CommonModule],
  templateUrl: './service-history.html',
  styleUrl: './service-history.css',
})
export class ServiceHistory implements OnInit {
  serviceRequests: any[] = [];

  constructor(
    private serviceRequestService: ServiceRequestService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.loadServiceHistory();
  }
  loadServiceHistory(): void {
    this.serviceRequestService.getMyServiceRequests().subscribe({
      next: (data) => {
        const activeStatuses = ['REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];
        this.serviceRequests = data
          .filter((r: any) => activeStatuses.includes(r.status))
          .reverse();
        this.cdr.detectChanges();
      },
      error: (err) => console.log('Error loading services', err)
    });
  }
}
