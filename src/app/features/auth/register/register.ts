import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  @Input() role: string = 'CUSTOMER';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required]],
      pincode: ['', [Validators.required]]
    });

    this.registerForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role']) {
        this.role = params['role'];
      }
    });
  }

  getTitle(): string {
    switch (this.role) {
      case 'TECHNICIAN':
        return 'Register as Technician';
      case 'MANAGER':
        return 'Register as Manager';
      default:
        return 'Create Account';
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.registerForm.value;

    if (this.role === 'CUSTOMER') {
      this.authService.registerCustomer(formData).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Please login.';
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error || 'Registration failed. Please try again.';
          this.cdr.detectChanges();
        }
      });
    } else {
      const staffData = { ...formData, role: this.role };
      this.authService.registerStaff(staffData).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Please login.';
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error || 'Registration failed. Please try again.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}