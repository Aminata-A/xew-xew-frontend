import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { jwtDecode } from 'jwt-decode'; // Vérifie que jwtDecode est bien importé
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, EventCardComponent],
})
export class MyEventsComponent implements OnInit {
  events: any[] = []; // Initialisation des événements
  upcomingEvents: any[] = []; // Initialisation des événements à venir
  pastEvents: any[] = []; // Initialisation des événements passés
  isAuthenticated: boolean = false;
  user: any = null;
  message: string = '';

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        // Vérifie si le token est expiré
        if (decodedToken.exp < currentTime) {
          this.message = 'Votre session a expiré. Veuillez vous reconnecter.';
          this.isAuthenticated = false;
          localStorage.removeItem('jwt_token');
          this.router.navigate(['/login']);
        } else {
          this.isAuthenticated = true;
          this.user = decodedToken;
          this.loadEvents();
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT', error);
        this.message = 'Token invalide. Veuillez vous reconnecter.';
        this.isAuthenticated = false;
      }
    } else {
      this.message = 'Vous devez être authentifié pour voir vos événements.';
      this.isAuthenticated = false;
    }
  }

  loadEvents() {
    this.eventService.getMyEvents().subscribe(
      (data: any[]) => {
        this.events = data;
        this.filterEvents();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.message = 'Vous devez être authentifié pour voir vos événements.';
        } else {
          console.error('Erreur lors du chargement des événements :', error);
          this.message = 'Erreur lors du chargement des événements.';
        }
      }
    );
  }

  filterEvents() {
    const currentDate = new Date();

    // Séparation des événements en à venir et passés
    this.upcomingEvents = this.events.filter(event => new Date(event.date) > currentDate);
    this.pastEvents = this.events.filter(event => new Date(event.date) <= currentDate);
  }

  onEditEvent(eventId: number) {
    this.router.navigate(['/form-event-edit', eventId]);
  }

  onDeleteEvent(eventId: number) {
    this.eventService.deleteEvent(eventId).subscribe(
      () => {
        this.loadEvents();
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors de la suppression de l\'événement :', error);
        this.loadEvents();
      }
    );
  }
}
