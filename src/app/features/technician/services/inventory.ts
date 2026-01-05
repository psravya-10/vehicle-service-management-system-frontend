import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {

    private partsUrl = 'http://localhost:9090/api/inventory/parts';
    private requestsUrl = 'http://localhost:9090/api/inventory/requests';

    constructor(private http: HttpClient, private authService: AuthService) { }

    getAllParts(): Observable<any[]> {
        return this.http.get<any[]>(this.partsUrl);
    }

    requestPart(serviceRequestId: string, partId: string, quantity: number): Observable<any> {
        const body = {
            serviceRequestId,
            technicianId: this.authService.getUserId(),
            partId,
            quantity
        };
        return this.http.post<any>(this.requestsUrl, body);
    }
}
