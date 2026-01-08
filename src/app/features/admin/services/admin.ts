import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    phone: string;
    pincode: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private baseUrl = 'http://localhost:9090/api';

    constructor(private http: HttpClient, private authService: AuthService) { }

    getAllStaff(status?: string, role?: string): Observable<StaffMember[]> {
        let url = `${this.baseUrl}/admin/staff`;
        const params: string[] = [];

        if (status && status !== 'ALL') {
            params.push(`status=${status}`);
        }
        if (role && role !== 'ALL') {
            params.push(`role=${role}`);
        }

        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        return this.http.get<StaffMember[]>(url);
    }

    getAllUsers(): Observable<StaffMember[]> {
        return this.http.get<StaffMember[]>(`${this.baseUrl}/admin/users`);
    }

    updateApproval(userId: string, approved: boolean): Observable<string> {
        return this.http.put(`${this.baseUrl}/admin/users/${userId}/approval?approved=${approved}`, {}, { responseType: 'text' });
    }


    getUserById(userId: string): Observable<StaffMember> {
        return this.http.get<StaffMember>(`${this.baseUrl}/customer/${userId}`);
    }

    getAllServiceRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/manager/service-requests`);
    }

    getPendingServiceRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/manager/service-requests/pending`);
    }

    getTechnicianWorkload(): Observable<{ [key: string]: number }> {
        return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/manager/service-requests/technicians/workload`);
    }

    // Billing reports
    getMonthlyRevenue(year: number, month: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/billing/admin/reports/monthly?year=${year}&month=${month}`);
    }

    getInvoicesByStatus(status: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/billing/admin/invoices?status=${status}`);
    }

    // Inventory endpoints (reusing)
    getAllParts(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/inventory/parts`);
    }

    getLowStockParts(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/inventory/parts/low-stock`);
    }

    restockPart(partId: string, quantity: number): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/inventory/parts/${partId}/restock?quantity=${quantity}`, {});
    }

    updateThreshold(partId: string, threshold: number): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/inventory/parts/${partId}/threshold?threshold=${threshold}`, {});
    }

    addPart(name: string, category: string, availableQuantity: number, unitPrice: number): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/inventory/parts`, { name, category, availableQuantity, unitPrice });
    }
}
