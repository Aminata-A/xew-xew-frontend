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
    return this.http.post(`${baseURL}/events`, eventData, { headers });
  }


  updateEvent(event: Event): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${baseURL}/events/${event.id}`, event, { headers });
  }

  getOrganizers(): Observable<any[]> {
    return this.http.get<any[]>(`${baseURL}/users?role=organizer`);
  }

  // Fonction pour récupérer les événements de l'utilisateur connecté
  getMyEvents(): Observable<any[]> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Envoi du token JWT dans l'en-tête Authorization
    });
    return this.http.get<any[]>(`${baseURL}/events/my-events`, { headers });
  }
   // Method to fetch events based on categories
   getEventsByCategories(categoryIds: number[]): Observable<any> {
    return this.http.post(`${baseURL}/events/similar`, { categories: categoryIds });
  }

}
