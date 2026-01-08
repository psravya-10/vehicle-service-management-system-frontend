import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../services/vehicle';
import { AuthService } from '../../../core/services/auth';
import { ServiceRequestService } from '../services/service-request';

@Component({
  selector: 'app-my-vehicles',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-vehicles.html',
  styleUrl: './my-vehicles.css'
})
export class MyVehicles implements OnInit {
  vehicles: any[] = [];
  showAddForm: boolean = false;
  showHistory: boolean = false;
  selectedVehicle: any = null;
  serviceHistory: any[] = [];
  errorMessage: string = '';

  newVehicle = {
    userId: '',
    registrationNumber: '',
    brand: '',
    model: '',
    vehicleType: 'CAR',
    manufactureYear: 2024
  };

  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService,
    private serviceRequestService: ServiceRequestService,
    private cdr: ChangeDetectorRef
  ) {
    this.newVehicle.userId = this.authService.getUserId() || '';
  }

  ngOnInit(): void {
    console.log('MyVehicles component initialized');
    console.log('User ID:', this.authService.getUserId());
    this.showAddForm = false;
    this.showHistory = false;
    this.loadVehicles();
  }

  loadVehicles(): void {
    console.log('Calling loadVehicles...');
    this.vehicleService.getMyVehicles().subscribe({
      next: (data) => {
        console.log('API Response:', data);
        this.vehicles = data.reverse(); // Newest first
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 503 || err.status === 500) {
          this.errorMessage = 'Vehicle Service is currently unavailable. Please try again later.';
        } else {
          this.errorMessage = err.error?.message || err.error || 'Failed to load vehicles.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.showHistory = false;
  }

  viewHistory(vehicle: any): void {
    this.selectedVehicle = vehicle;
    this.showHistory = true;
    this.showAddForm = false;

    this.serviceRequestService.getByVehicleId(vehicle.id).subscribe({
      next: (data) => {
        this.serviceHistory = data.reverse();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 503 || err.status === 500) {
          this.errorMessage = 'Service Request Service is currently unavailable. Please try again later.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  backToList(): void {
    this.showHistory = false;
    this.selectedVehicle = null;
    this.serviceHistory = [];
  }

  addVehicle(): void {
    this.errorMessage = '';
    this.newVehicle.userId = this.authService.getUserId() || '';
    this.vehicleService.addVehicle(this.newVehicle).subscribe({
      next: () => {
        this.loadVehicles();
        this.showAddForm = false;
        this.resetForm();
      },
      error: (err) => {

        if (err.error && typeof err.error === 'object' && !err.error.message) {

          const errorMessages = Object.values(err.error) as string[];
          this.errorMessage = errorMessages[0] || 'Please fill in all required fields';
        } else {
          // Handle business logic errors (like duplicate registration)
          this.errorMessage = err.error?.message || err.error || 'Failed to add vehicle';
        }
        this.cdr.detectChanges();
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  resetForm(): void {
    this.newVehicle = {
      userId: this.authService.getUserId() || '',
      registrationNumber: '',
      brand: '',
      model: '',
      vehicleType: 'CAR',
      manufactureYear: 2024
    };
  }
}
