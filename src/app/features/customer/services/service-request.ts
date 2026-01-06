import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  private apiUrl = 'http://localhost:9090/api/customer/service-requests';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const userId = this.authService.getUserId() || '';
    return new HttpHeaders().set('X-User-Id', userId);
  }

  createRequest(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }

  getRequestById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getByVehicleId(vehicleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
  }

  getMyServiceRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`, { headers: this.getHeaders() });
  }
}
