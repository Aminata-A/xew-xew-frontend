import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Ticket {
  id: string;
  event_name: string;
  organizer_id: string;
  date: Date;
  time: string;
  location: string;
  ticket_price: number;
}

interface Organizer {
  id: string;
  name: string;
}

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TicketCardComponent implements OnInit {
  tickets: Ticket[] = []; // Stocke tous les tickets
  organizers: Organizer[] = []; // Stocke tous les organisateurs
  selectedTicket!: Ticket; // Ticket sélectionné
  selectedOrganizerName: string = ''; // Nom de l'organisateur sélectionné

  constructor() {}

  ngOnInit(): void {
    this.loadOrganizers();
    this.loadTickets();
  }

  // Charger les tickets fictifs directement dans le composant
  loadTickets(): void {
    this.tickets = [
      {
        id: 'T001',
        event_name: 'Concert de Jazz',
        organizer_id: 'ORG001',
        date: new Date('2024-11-15'),
        time: '20:00',
        location: 'Salle de concert de Paris',
        ticket_price: 15000,
      },
      {
        id: 'T002',
        event_name: 'Conférence Tech',
        organizer_id: 'ORG002',
        date: new Date('2024-12-02'),
        time: '09:00',
        location: 'Centre des Congrès, Dakar',
        ticket_price: 10000,
      },
      {
        id: 'T003',
        event_name: 'Festival de Film',
        organizer_id: 'ORG003',
        date: new Date('2024-10-20'),
        time: '18:30',
        location: 'Cinéma Le Majestic, Abidjan',
        ticket_price: 8000,
      },
      {
        id: 'T004',
        event_name: 'Spectacle de Danse',
        organizer_id: 'ORG004',
        date: new Date('2024-11-28'),
        time: '19:00',
        location: 'Théâtre National, Yaoundé',
        ticket_price: 12000,
      }
    ];

    this.selectedTicket = this.tickets[0]; // Sélectionne le premier ticket
    this.updateOrganizerName(); // Mettre à jour le nom de l'organisateur
  }

  // Charger les organisateurs fictifs
  loadOrganizers(): void {
    this.organizers = [
      { id: 'ORG001', name: 'Jazz Events' },
      { id: 'ORG002', name: 'Tech Talks' },
      { id: 'ORG003', name: 'Film Festivals' },
      { id: 'ORG004', name: 'Dance Performers' },
    ];
  }

  // Récupérer le nom de l'organisateur à partir de l'ID du ticket
  updateOrganizerName(): void {
    const organizer = this.organizers.find(org => org.id === this.selectedTicket.organizer_id);
    if (organizer) {
      this.selectedOrganizerName = organizer.name;
    }
  }
}

 


// import { CommonModule } from '@angular/common';
// import { Component, OnInit, inject } from '@angular/core';
// import { EventService } from 'src/app/services/event.service';
// import { Event } from 'src/app/services/interfaces';

// @Component({
//   selector: 'app-ticket-card',
//   templateUrl: './ticket-card.component.html',
//   styleUrls: ['./ticket-card.component.scss'],
//   standalone: true,
//   imports: [CommonModule],
// })
// export class TicketCardComponent implements OnInit {

//   private eventService = inject(EventService);  // Injection du service
//   events: Event[] = [];  // Stocke tous les événements
//   selectedEvent!: Event; // L'événement sélectionné pour l'affichage du ticket

//   constructor() {}

//   ngOnInit(): void {
//     this.loadEvents();
//   }

//   // Charger les événements via le service
//   loadEvents(): void {
//     this.eventService.getEvents().subscribe({
//       next: (events: Event[]) => {
//         this.events = events;
//         this.selectedEvent = this.events[0];  // Sélectionner le premier événement pour l'affichage (exemple)
//       },
//       error: (err) => {
//         console.error('Erreur lors du chargement des événements :', err);
//       }
//     });
//   }
// }
