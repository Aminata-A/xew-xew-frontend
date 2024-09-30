import { TicketService } from './../services/ticket.service';
import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { EventService } from '../services/event.service';
import { Event } from '../services/interfaces';
import { EventCardComponent } from '../components/event-card/event-card.component';
import { TicketCardComponent } from '../components/ticket-card/ticket-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, EventCardComponent, TicketCardComponent],
})
export class HomePage {

  private eventservice = inject(EventService);

  private ticketservice = inject(TicketService);

  events: Event[] = <Event[]>[];

  tickets: Event[] = <Event[]>[];

  constructor() {
    this.loadEvents();
    this.loadTicket();
  }

  loadEvents() {
    this.eventservice.getEvents().subscribe({
      next: (data) => {
        this.events = data;
      }
    });
  }

  loadTicket() {
    this.ticketservice.getTickets().subscribe({
      next: (data) => {
        // this.tickets = data;
      }
    })
  }
}
