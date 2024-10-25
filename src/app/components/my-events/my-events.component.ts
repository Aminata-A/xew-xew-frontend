import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { EventService } from 'src/app/services/event.service';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { EventCardComponent } from '../event-card/event-card.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from 'src/app/services/category.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, EventCardComponent, RouterLink], // Add FormsModule here
})
export class MyEventsComponent implements OnInit {
  events: any[] = [];
  upcomingEvents: any[] = [];
  pastEvents: any[] = [];
  isAuthenticated: boolean = false;
  user: any = null;
  message: string = '';
  newCategory: string = '';
  errorMessage: string = '';
  showCategoryForm: boolean = false;

  // Pagination
  currentPage: number = 1;
  eventsPerPage: number = 12;
  paginatedUpcomingEvents: any[] = [];
  paginatedPastEvents: any[] = [];

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

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
    this.upcomingEvents = this.events.filter((event) => new Date(event.date) > currentDate);
    this.pastEvents = this.events.filter((event) => new Date(event.date) <= currentDate);
    this.setPage(1);
  }

  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.eventsPerPage;
    const endIndex = startIndex + this.eventsPerPage;

    this.paginatedUpcomingEvents = this.upcomingEvents.slice(startIndex, endIndex);
    this.paginatedPastEvents = this.pastEvents.slice(startIndex, endIndex);
  }

  totalPages(eventsArray: any[]): number {
    return Math.ceil(eventsArray.length / this.eventsPerPage);
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
        console.error("Erreur lors de la suppression de l'événement :", error);
        this.loadEvents();
      }
    );
  }
}
