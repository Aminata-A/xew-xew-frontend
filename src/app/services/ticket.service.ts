import { Observable } from 'rxjs';
import { HttpClient,  } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Ticket } from './interfaces';


@Injectable({
  providedIn: 'root',
})
export class TicketService {

  private baseUrl = 'http://127.0.0.1:8000/api/tickets';  // URL de base pour accéder à l'API backend

  constructor(private http: HttpClient) {}

  // Récupérer les tickets de l'utilisateur connecté
 // Récupérer les tickets de l'utilisateur
 getUserTickets(): Observable<any> {
  const token = localStorage.getItem('jwt_token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(this.baseUrl, { headers });
}

  // Créer une commande de tickets
  createTransaction(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

}
