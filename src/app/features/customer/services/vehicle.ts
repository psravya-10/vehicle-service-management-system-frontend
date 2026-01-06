import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = 'http://localhost:9090/api/customer/vehicles';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const userId = this.authService.getUserId() || '';
    return new HttpHeaders().set('X-User-Id', userId);
  }

  getMyVehicles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getVehicleById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addVehicle(vehicle: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, vehicle);
  }

  updateVehicle(id: string, vehicle: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, vehicle);
  }
}
