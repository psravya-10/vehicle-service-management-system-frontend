import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

@Injectable({
    providedIn: 'root'
})
export class ManagerService {

    private baseUrl = 'http://localhost:9090/api';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const userId = this.authService.getUserId() || '';
        return new HttpHeaders().set('X-User-Id', userId);
    }

    getAllServiceRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/manager/service-requests`);
    }

    getPendingServiceRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/manager/service-requests/pending`);
    }

    assignServiceRequest(id: string, technicianId: string, bayId: string): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/manager/service-requests/${id}/assign`, { technicianId, bayId });
    }

    closeServiceRequest(id: string, labourCharges: number): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/manager/service-requests/${id}/close?labourCharges=${labourCharges}`, {});
    }

    getAllTechnicians(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/manager/technicians`);
    }

    getAvailableTechnicians(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/manager/technicians/available`);
    }

    getTechnicianWorkload(): Observable<{ [key: string]: number }> {
        return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/manager/service-requests/technicians/workload`);
    }

    getAllBays(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/bays`);
    }

    getAvailableBays(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/bays/available`);
    }

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

    getAllPartRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/inventory/requests`);
    }

    getPendingPartRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/inventory/requests?status=REQUESTED`);
    }

    approvePartRequest(requestId: string): Observable<any> {
        const managerId = this.authService.getUserId() || '';
        return this.http.put<any>(`${this.baseUrl}/inventory/requests/${requestId}/approve?managerId=${managerId}`, {});
    }
}
