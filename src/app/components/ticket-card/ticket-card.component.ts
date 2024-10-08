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
    this.selectedTicket = this.tickets[0]; // Sélectionne le premier ticket
    this.updateOrganizerName(); // Mettre à jour le nom de l'organisateur
  }

  // Charger les organisateurs fictifs
  loadOrganizers(): void {
    this.organizers = [
      // { id: 'ORG001', name: 'Jazz Events' },
      // { id: 'ORG002', name: 'Tech Talks' },
      // { id: 'ORG003', name: 'Film Festivals' },
      // { id: 'ORG004', name: 'Dance Performers' },
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
