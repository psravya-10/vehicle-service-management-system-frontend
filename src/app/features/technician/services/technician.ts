import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

@Injectable({
    providedIn: 'root'
})
export class TechnicianService {

    private apiUrl = 'http://localhost:9090/api/technician/service-requests';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const userId = this.authService.getUserId() || '';
        return new HttpHeaders().set('X-User-Id', userId);
    }

    getMyAssignedTasks(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    updateStatus(id: string, status: string, remarks?: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/status`, { status, remarks });
    }
}
