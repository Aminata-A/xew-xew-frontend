import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnInit, input } from '@angular/core';
import { pipe } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/services/interfaces';
@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class EventCardComponent implements OnInit {
  @Input() public variant!: number;
  @Input() public event!: Event;
  constructor( private eventService: EventService) {}

  events: Event[] = [];
  filteredEvents: Event[] = [];

  ngOnInit() {
    this.loadEvents();
  }

    // Charger tous les événements à partir du service
    loadEvents() {
      this.eventService.getEvents().subscribe({
        next: (events) => {
          this.events = events;
          this.applyFilter();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des événements:', err);
        }
      });
    }

  applyFilter() {
    const today = new Date();

    if (this.variant === 1) {
      // Afficher uniquement les événements publiés et "À la une"
      this.filteredEvents = this.events.filter(event => event.event_status === 'publier');
    } else if (this.variant === 2) {
      // Afficher uniquement les événements récents (ex: dans les 7 derniers jours)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      this.filteredEvents = this.events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= sevenDaysAgo && eventDate <= today;
      });
    } else {
      // Afficher tous les événements
      this.filteredEvents = this.events;
    }
  }
}
