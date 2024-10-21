import { Observable } from 'rxjs';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Event, Register } from '../services/interfaces';


const baseURL = 'http://127.0.0.1:8000/api';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  private http = inject(HttpClient);

  constructor() { }


  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getEvents() {
    return this.http.get<Event[]>(`${baseURL}/events`);
  }

  getEvent(id: number) {
    return this.http.get<Event>(`${baseURL}/events/${id}`);
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

    // Utilisation correcte de `eventData` et non `FormData`
    return this.http.put(`${baseURL}/events/${eventId}`, eventData, { headers });
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
    return this.http.get<Event[]>(`${baseURL}/events?category=${categoryId}`);
  }

  // fonction pour recuperer les evenements d'une catForSegue
  getEventsByCategories(categoryIds: number[]): Observable<Event[]> {
    const params = categoryIds.map(id => `category=${id}`).join('&');
    return this.http.get<Event[]>(`${baseURL}/events?${params}`);
  }

  deleteEvent(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${baseURL}/events/${id}`, { headers });
  }

}
