import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/services/interfaces';

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TicketCardComponent implements OnInit {

  private eventService = inject(EventService);  // Injection du service
  events: Event[] = [];  // Stocke tous les événements
  selectedEvent!: Event; // L'événement sélectionné pour l'affichage du ticket

  constructor() {}

  ngOnInit(): void {
    this.loadEvents();
  }

  // Charger les événements via le service
  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events: Event[]) => {
        this.events = events;
        this.selectedEvent = this.events[0];  // Sélectionner le premier événement pour l'affichage (exemple)
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements :', err);
      }
    });
  }
}
