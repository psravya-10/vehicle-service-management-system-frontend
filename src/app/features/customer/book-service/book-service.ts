import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../services/vehicle';
import { ServiceRequestService } from '../services/service-request';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-book-service',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-service.html',
  styleUrl: './book-service.css'
})
export class BookService implements OnInit {
  vehicles: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  serviceRequest = {
    userId: '',
    vehicleId: '',
    issueDescription: '',
    priority: 'NORMAL'
  };

  constructor(
    private vehicleService: VehicleService,
    private serviceRequestService: ServiceRequestService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.serviceRequest.userId = this.authService.getUserId() || '';
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getMyVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log('Error loading vehicles', err)
    });
  }

  submitRequest(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.serviceRequest.vehicleId) {
      this.errorMessage = 'Please select a vehicle';
      return;
    }

    if (!this.serviceRequest.issueDescription) {
      this.errorMessage = 'Please describe the issue';
      return;
    }

    this.serviceRequestService.createRequest(this.serviceRequest).subscribe({
      next: () => {
        this.successMessage = 'Successfully booked your service!';
        this.resetForm();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error || 'Vehicle already in service';
        this.cdr.detectChanges();
        console.log('Error:', err);
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  resetForm(): void {
    this.serviceRequest = {
      userId: this.authService.getUserId() || '',
      vehicleId: '',
      issueDescription: '',
      priority: 'NORMAL'
    };
  }
}
