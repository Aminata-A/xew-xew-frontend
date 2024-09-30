import { HttpClient,  } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Ticket } from './interfaces';

const baseURL = 'http://127.0.0.1:8000/api';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor() {}

  private HttpClient = inject(HttpClient);

  getTickets() {
    return this.HttpClient.get<Ticket[]>(`${baseURL}/tickets`);
  }
}
