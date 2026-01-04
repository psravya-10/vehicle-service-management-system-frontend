import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard as CustomerDashboard } from './features/customer/dashboard/dashboard';
import { Dashboard as TechnicianDashboard } from './features/technician/dashboard/dashboard';
import { Dashboard as ManagerDashboard } from './features/manager/dashboard/dashboard';
import { Dashboard as AdminDashboard } from './features/admin/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', redirectTo: '' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'customer/dashboard', component: CustomerDashboard, canActivate: [authGuard] },
    { path: 'technician/dashboard', component: TechnicianDashboard, canActivate: [authGuard] },
    { path: 'manager/dashboard', component: ManagerDashboard, canActivate: [authGuard] },
    { path: 'admin/dashboard', component: AdminDashboard, canActivate: [authGuard] }
];
