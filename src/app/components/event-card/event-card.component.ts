import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740';

  events: Event[] = [];

  constructor(private router: Router, private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents(); // Charger les événements au démarrage du composant
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(
      (events: Event[]) => {
        this.events = events; // Affecter les événements récupérés
      },
      (error) => {
        console.error('Erreur lors du chargement des événements', error);
      }
    );
  }

  getOrganizerName(organizerId: number): string {
    const organizer = this.events.find((org) => org.organizer_id === organizerId);
    console.log(organizer);
    return organizer ? organizer.name : 'Inconnu';
  }

  goToEventDetails(eventId: number | undefined) {
    if (eventId) {
      this.router.navigate(['/event-details', eventId]).then(() => {
        window.location.reload();
      });
    } else {
      console.error("L'ID de l'événement est indéfini");
    }
  }
}
