import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

export interface UsedPart {
    partId: string;
    partName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Invoice {
    id: string;
    serviceRequestId: string;
    userId: string;
    vehicleId: string;
    labourCharges: number;
    partsUsed: UsedPart[];
    partsTotal: number;
    totalAmount: number;
    paymentStatus: string;
    createdAt: string;
    paidAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class BillingService {

    private apiUrl = 'http://localhost:9090/api/billing';

    constructor(private http: HttpClient, private authService: AuthService) { }

    getMyInvoices(): Observable<Invoice[]> {
        const userId = this.authService.getUserId();
        return this.http.get<Invoice[]>(`${this.apiUrl}/user/${userId}`);
    }

    getInvoiceByServiceRequest(serviceRequestId: string): Observable<Invoice> {
        return this.http.get<Invoice>(`${this.apiUrl}/service-request/${serviceRequestId}`);
    }

    payInvoice(invoiceId: string): Observable<string> {
        return this.http.put(`${this.apiUrl}/customer/invoices/${invoiceId}/pay`, {}, { responseType: 'text' });
    }
}
