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
import Swal from 'sweetalert2';


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
  deleteMessage: string = '';
  public ticketsRemaining: number = 0;


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

  // Méthode de modification d'un événement
  onEditEvent(eventId: number, ticketsSold: number) {
    if (ticketsSold > 0) {
      this.message = "Il y a déjà un ticket acheté pour cet événement. Vous ne pouvez pas le modifier. Si c'est urgent, appelez le service client.";
      setTimeout(() => {
        this.message = ''; // Cache le message après 5 secondes
      }, 5000);
      return; // Arrête la fonction
    }
    this.router.navigate(['/form-event-edit', eventId]); // Redirige si pas de ticket vendu
  }

  // Méthode de suppression d'un événement
  onDeleteEvent(eventId: number, ticketsSold: number, eventDate: string): void {
    const currentDate = new Date();
    const isEventPast = new Date(eventDate) <= currentDate;

    // Afficher la confirmation de suppression avec SweetAlert2
    Swal.fire({
      title: '<strong style="color: #FF773D;">Êtes-vous sûr?</strong>',
      html: `<p style="color: #1b1b1b;">Voulez-vous vraiment supprimer cet événement?</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non, annuler',
      customClass: {
        confirmButton: 'styled-confirm-btn',
        cancelButton: 'styled-cancel-btn',
        popup: 'styled-popup',
      },
      buttonsStyling: false, // Désactive les styles par défaut pour appliquer des styles personnalisés
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme, procéder avec la suppression
        if (!isEventPast && ticketsSold > 0) {
          this.message = "Il y a déjà un ticket acheté pour cet événement. Vous ne pouvez pas le supprimer. Si c'est urgent, appelez le service client.";
          setTimeout(() => {
            this.message = ''; // Cache le message après 5 secondes
          }, 5000);
          return; // Arrête la fonction si l'événement n'est pas passé et des tickets sont vendus
        }

        // Effectuer la suppression si l'événement est passé ou si aucun ticket n'a été vendu
        this.eventService.deleteEvent(eventId).subscribe(
          () => {
            this.deleteMessage = 'Événement supprimé avec succès';
            setTimeout(() => {
              this.deleteMessage = '';
            }, 3000);
            this.loadEvents(); // Recharger les événements après suppression
          },
          (error) => {
            console.error("Erreur lors de la suppression de l'événement :", error);
          }
        );
      }
    });
  }
  getEventImage(event: any): string {
    return event.banner
    ? 'http://127.0.0.1:8000' + event.banner
    : 'https://img.freepik.com/premium-photo/indian-republic-day-concept-indian-flag-print-air-balloon-with-copy-space-banner_742418-20690.jpg?w=1060';
  }


}
