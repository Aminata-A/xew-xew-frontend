import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Event, Register } from '../services/interfaces';
import { TicketType } from './interfaces'; // Assurez-vous que le chemin est correct


const baseURL = 'http://127.0.0.1:8000/api';
@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);

  constructor() {}

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getEvents() {
    return this.http.get<Event[]>(`${baseURL}/events`);
  }
  // getEvent(id: number): Observable<{ event: Event; ticket_types: TicketType[]; tickets_remaining: number }> {
  //   return this.http.get<{ event: Event; ticket_types: TicketType[]; tickets_remaining: number }>(`${baseURL}/events/${id}`);
  // }
  // Dans EventService
// event.service.ts
getEvent(id: number): Observable<{ event: Event; ticket_types: TicketType[]; tickets_remaining: number }> {
  return this.http.get<{ event: Event; ticket_types: TicketType[]; tickets_remaining: number }>(`${baseURL}/events/${id}`);
}


// event.service.ts (exemple)
getSimilarEvents(eventId: number): Observable<Event[]> {
  return this.http.get<Event[]>(`${baseURL}/events/${eventId}/similar`);
}




  createEvent(eventData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<Event>(`${baseURL}/events`, eventData, { headers });
  }

  updateEvent(eventId: number, eventData: FormData): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Suppression de `Content-Type` pour laisser Angular le gérer automatiquement
    return this.http.post(`${baseURL}/events/${eventId}/update`, eventData, {
      headers,
    });
  }

  getEventDashboard(id: number): Observable<any> {
    return this.http.get(`${baseURL}/events/${id}/dashboard`);
  }

  getOrganizers(): Observable<any[]> {
    return this.http.get<any[]>(`${baseURL}/users`);
  }

  // Fonction pour récupérer les événements de l'utilisateur connecté
  getMyEvents(): Observable<any[]> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Envoi du token JWT dans l'en-tête Authorization
    });
    return this.http.get<any[]>(`${baseURL}/events/my-events`, { headers });
  }
  // fonction pour recuperer les evenements d'une catégorie
  getEventsByCategory(categoryId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${baseURL}/events?category_id=${categoryId}`);
  }


  // fonction pour recuperer les evenements d'une catForSegue
  getEventsByCategories(categoryIds: number[]): Observable<Event[]> {
    const params = categoryIds.map((id) => `category=${id}`).join('&');
    return this.http.get<Event[]>(`${baseURL}/events?${params}`);
  }

  deleteEvent(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${baseURL}/events/${id}`, { headers });
  }
}
