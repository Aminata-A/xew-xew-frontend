import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Register } from './interfaces'; // Assurez-vous que votre interface est importée

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de votre API backend

  constructor(private http: HttpClient) {}

  getToken() {
    return localStorage.getItem('jwtToken'); // Vérifie si un token est stocké
  }


  isAuthenticated(): boolean {
    return !!this.getToken(); // Retourne vrai si l'utilisateur est connecté
  }

  verifyEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-email`, { email });
  }

  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-code`, { email, code });
  }

  register(data: Register, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
    });
    return this.http.post(`${this.apiUrl}/auth/register`, data, { headers });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  // Mettre à jour le profil utilisateur
  updateProfile(data: Register, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(`${this.apiUrl}/auth/user-profile`, data, { headers });
  }

   logout(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers });
  }

  getUserProfile(token: string): Observable<Register> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Register>(`${this.apiUrl}/auth/user-profile`, { headers });
  }
}
