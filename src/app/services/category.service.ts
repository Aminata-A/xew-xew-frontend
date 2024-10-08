import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private baseURL = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    } else {
      return new HttpHeaders(); // Aucun header d'authentification si non connecté
    }
  }

  // Récupérer les catégories disponibles, avec ou sans token
  getCategories(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseURL}/categories`, { headers });
  }

  // Créer une nouvelle catégorie (nécessite un token)
  createCategory(category: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseURL}/categories`, category, { headers });
  }

  // Mettre à jour une catégorie existante (nécessite un token)
  updateCategory(category: any, id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseURL}/categories/${id}`, category, { headers });
  }

  // Supprimer une catégorie (nécessite un token)
  deleteCategory(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseURL}/categories/${id}`, { headers });
  }
}
