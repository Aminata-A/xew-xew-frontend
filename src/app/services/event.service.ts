import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Event } from '../services/interfaces';

const baseURL = 'http://127.0.0.1:8000/api';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  private http = inject(HttpClient);

  constructor() { }

  getEvents() {
    return this.http.get<Event[]>(`${baseURL}/events`);
  }

  getEvent(id: number) {
    return this.http.get<Event>(`${baseURL}/events/${id}`);
  }

  createEvent(event: Event) {
    return this.http.post(`${baseURL}/events`, event);
  }

  updateEvent(event: Event) {
    return this.http.put(`${baseURL}/events/${event.id}`, event);
  }
}
