import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TicketService {

  private baseUrl = 'http://127.0.0.1:8000/api/tickets';  // URL de base pour accéder à l'API backend

  constructor(private http: HttpClient) {}

  // Récupérer les tickets de l'utilisateur connecté
  getUserTickets(): Observable<any> {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      console.error('Token JWT non disponible');
      return throwError(() => new Error('Token JWT non disponible'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.error('Erreur 401: Utilisateur non authentifié ou token invalide');
        }
        return throwError(() => error);
      })
    );
  }

  // Créer une commande de tickets
  createTransaction(data: any): Observable<any> {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      return throwError(() => new Error('Token JWT non disponible'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.baseUrl, data, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création de la transaction', error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour récupérer les détails d'un billet spécifique
  getTicket(ticketId: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      console.error('Token JWT non disponible');
      return throwError(() => new Error('Token JWT non disponible'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.baseUrl}/${ticketId}`, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.error('Erreur 401: Utilisateur non authentifié ou token invalide');
        }
        return throwError(() => error);
      })
    );
  }



  // Méthode pour scanner un ticket
  scanTicket(ticketId: string): Observable<any> {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      console.error('Token JWT non disponible');
      return throwError(() => new Error('Token JWT non disponible'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.baseUrl}/scan/${ticketId}`, {}, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.error('Erreur 401: Utilisateur non authentifié ou token invalide');
        }
        if (error.status === 400) {
          console.error('Erreur 400: Le ticket a déjà été scanné ou est invalide');
        }
        return throwError(() => error);
      })
    );
  }


  // Méthode pour récupérer les statistiques d'un événement


   // Fonction pour ajouter le token JWT dans les headers
   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      console.error('Token JWT non disponible');
      throw new Error('Token JWT non disponible');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error('Erreur API', error);
    return throwError(() => new Error(error.message || 'Erreur serveur'));
  }

  getEventStatistics(eventId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${eventId}/statistics`);
  }

  getUsersForEvent(eventId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${eventId}/users`);
  }
  }


