import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { ConfirmModal } from '../confirm-modal/confirm-modal';
import { ProfileModal } from '../profile-modal/profile-modal';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, ConfirmModal, ProfileModal],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  @Input() title: string = 'Dashboard';
  showDropdown: boolean = false;
  showProfileModal: boolean = false;
  showLogoutConfirm: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  openProfileModal(): void {
    this.showDropdown = false;
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  openLogoutConfirm(): void {
    this.showDropdown = false;
    this.showLogoutConfirm = true;
  }

  cancelLogout(): void {
    this.showLogoutConfirm = false;
  }

  confirmLogout(): void {
    this.showLogoutConfirm = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }
}