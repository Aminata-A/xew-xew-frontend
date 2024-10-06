import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importer le Router pour la navigation
import { Event } from 'src/app/services/interfaces';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class EventCardComponent implements OnInit {
  @Input() public variant!: number; // Variante pour l'affichage
  @Input() public event!: Event; // L'événement à afficher

  events: Event[] = [];
  filteredEvents: Event[] = [];

  constructor(private router: Router) {}

  mockEvents: Event[] = [
    {
      id: 1,
      name: 'Concert Jazz',
      description: 'Un concert de jazz incroyable à ne pas manquer.',
      date: '2024-10-10',
      location: 'Dakar',
      time: '18:00',
      banner: 'https://example.com/jazz.jpg',
      organizer_id: 1,
      ticket_price: 10000,
      ticket_quantity: 200,
      event_status: 'publier',
    },
    {
      id: 2,
      name: 'Conférence Tech',
      description: 'Rejoignez-nous pour une conférence tech passionnante.',
      date: '2024-10-15',
      location: 'Abidjan',
      time: '10:00',
      banner: 'https://example.com/tech.jpg',
      organizer_id: 2,
      ticket_price: 5000,
      ticket_quantity: 300,
      event_status: 'publier',
    },
    {
      id: 3,
      name: 'Festival de Musique',
      description: 'Un festival de musique avec des artistes internationaux.',
      date: '2024-11-01',
      location: 'Paris',
      time: '20:00',
      banner: 'https://example.com/music.jpg',
      organizer_id: 1,
      ticket_price: 15000,
      ticket_quantity: 100,
      event_status: 'publier',
    },
  ];

  organizers: { id: number; name: string }[] = [
    { id: 1, name: 'Jazz Events' },
    { id: 2, name: 'Tech Events' },
  ];

  ngOnInit() {
    this.loadEvents();
    this.loadOrganizers();
  }

  loadEvents() {
    this.events = this.mockEvents;
    this.applyFilter();
  }

  loadOrganizers() {
    // Simuler les organisateurs
    this.organizers = [
      { id: 1, name: 'Jazz Events' },
      { id: 2, name: 'Tech Events' },
    ];
  }

  applyFilter() {
    if (this.variant === 1) {
      this.filteredEvents = this.events.filter(
        (event) => event.event_status === 'publier'
      );
    }
  }

  getOrganizerName(organizerId: number): string {
    const organizer = this.organizers.find((org) => org.id === organizerId);
    return organizer ? organizer.name : 'Inconnu';
  }

  // // Méthode pour naviguer vers les détails de l'événement
  // goToEventDetails(eventId: number | undefined) {
  //   if (eventId) {
  //     this.router.navigate(['/event-details', eventId]);
  //   } else {
  //     console.error('L\'ID de l\'événement est indéfini');
  //   }
  // }
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

// import { CommonModule } from '@angular/common';
// import { Component, Input, inject, OnInit, input } from '@angular/core';
// import { pipe } from 'rxjs';
// import { EventService } from 'src/app/services/event.service';
// import { Event } from 'src/app/services/interfaces';
// @Component({
//   selector: 'app-event-card',
//   templateUrl: './event-card.component.html',
//   styleUrls: ['./event-card.component.scss'],
//   standalone: true,
//   imports: [CommonModule],
// })
// export class EventCardComponent implements OnInit {
//   @Input() public variant!: number;
//   @Input() public event!: Event;
//   constructor( private eventService: EventService) {}

//   events: Event[] = [];
//   filteredEvents: Event[] = [];

//   ngOnInit() {
//     this.loadEvents();
//   }

//     // Charger tous les événements à partir du service
//     loadEvents() {
//       this.eventService.getEvents().subscribe({
//         next: (events) => {
//           this.events = events;
//           this.applyFilter();
//         },
//         error: (err) => {
//           console.error('Erreur lors du chargement des événements:', err);
//         }
//       });
//     }

//   applyFilter() {
//     const today = new Date();

//     if (this.variant === 1) {
//       // Afficher uniquement les événements publiés et "À la une"
//       this.filteredEvents = this.events.filter(event => event.event_status === 'publier');
//     } else if (this.variant === 2) {
//       // Afficher uniquement les événements récents (ex: dans les 7 derniers jours)
//       const sevenDaysAgo = new Date();
//       sevenDaysAgo.setDate(today.getDate() - 7);
//       this.filteredEvents = this.events.filter(event => {
//         const eventDate = new Date(event.date);
//         return eventDate >= sevenDaysAgo && eventDate <= today;
//       });
//     } else {
//       // Afficher tous les événements
//       this.filteredEvents = this.events;
//     }
//   }
// }
