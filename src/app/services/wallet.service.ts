import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseURL = 'http://127.0.0.1:8000/api';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getWallets(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${baseURL}/wallets`, { headers });
  }

  createWallet(wallet: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${baseURL}/wallets`, wallet, { headers });
  }

  updateWallet(wallet: any, id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${baseURL}/wallets/${id}`, wallet, { headers });
  }

  deleteWallet(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${baseURL}/wallets/${id}`, { headers });
  }
}
