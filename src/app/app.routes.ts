import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard as CustomerDashboard } from './features/customer/dashboard/dashboard';
import { Dashboard as TechnicianDashboard } from './features/technician/dashboard/dashboard';
import { Dashboard as ManagerDashboard } from './features/manager/dashboard/dashboard';
import { Dashboard as AdminDashboard } from './features/admin/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { BookService } from './features/customer/book-service/book-service';
import { ServiceHistory } from './features/customer/service-history/service-history';
import { MyVehicles } from './features/customer/my-vehicles/my-vehicles';
import { AssignedTasks } from './features/technician/assigned-tasks/assigned-tasks';
import { ActiveTasks } from './features/technician/active-tasks/active-tasks';
import { PartsRequest } from './features/technician/parts-request/parts-request';
import { ServiceRequests } from './features/manager/service-requests/service-requests';
import { Technicians } from './features/manager/technicians/technicians';
import { ServiceBays } from './features/manager/service-bays/service-bays';
import { PartsInventory } from './features/manager/parts-inventory/parts-inventory';
import { PartRequests } from './features/manager/part-requests/part-requests';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', redirectTo: '' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    {
        path: 'customer/dashboard', component: CustomerDashboard, canActivate: [authGuard], children: [
            { path: '', redirectTo: 'my-vehicles', pathMatch: 'full' },
            { path: 'my-vehicles', component: MyVehicles },
            { path: 'book-service', component: BookService },
            { path: 'service-history', component: ServiceHistory }
        ]
    },
    {
        path: 'technician/dashboard', component: TechnicianDashboard, canActivate: [authGuard], children: [
            { path: '', redirectTo: 'assigned-tasks', pathMatch: 'full' },
            { path: 'assigned-tasks', component: AssignedTasks },
            { path: 'active-tasks', component: ActiveTasks },
            { path: 'parts-request', component: PartsRequest }
        ]
    },
    {
        path: 'manager/dashboard', component: ManagerDashboard, canActivate: [authGuard], children: [
            { path: '', redirectTo: 'service-requests', pathMatch: 'full' },
            { path: 'service-requests', component: ServiceRequests },
            { path: 'technicians', component: Technicians },
            { path: 'service-bays', component: ServiceBays },
            { path: 'parts-inventory', component: PartsInventory },
            { path: 'part-requests', component: PartRequests }
        ]
    },
    { path: 'admin/dashboard', component: AdminDashboard, canActivate: [authGuard] }
];
