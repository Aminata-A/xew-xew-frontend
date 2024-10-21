import { CategoryComponent } from 'src/app/components/category/category.component';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { EventCardComponent } from 'src/app/components/event-card/event-card.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/services/interfaces';
import { NgFor } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: true,
  imports: [SidebarComponent, EventCardComponent, CategoryComponent, NgFor, HeaderComponent],
})
export class EventPage implements OnInit {
  featuredEvents: Event[] = [];  // À la une
  newEvents: Event[] = [];       // Nouveaux événements
  allEvents: Event[] = [];       // Tous les événements
  categories: any[] = [];        // Ajout pour les catégories
  token: string | null = null;   // Variable pour le token

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.checkUserConnection(); // Vérifier la connexion de l'utilisateur
    this.loadEvents();
    this.loadCategories();
  }

  checkUserConnection() {
    this.token = localStorage.getItem('jwt_token'); // Récupérer le token depuis localStorage
    if (this.token) {
      console.log('Token récupéré depuis localStorage:', this.token);
    } else {
      console.warn('Aucun token trouvé, utilisateur non connecté');
    }
  }

  loadEvents() {
    console.log('Chargement des événements...');
    this.eventService.getEvents().subscribe(
      (events: Event[]) => {
        console.log('Événements récupérés:', events);
        const sortedByTicketQuantity = events.sort((a, b) => b.ticket_quantity - a.ticket_quantity);
        this.featuredEvents = sortedByTicketQuantity.slice(0, 3);

        const today = new Date();
        this.newEvents = events
          .filter((event) => {
            const eventDate = new Date(event.date);
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(today.getDate() - 7);
            return eventDate >= oneWeekAgo;
          })
          .slice(0, 8);

        this.allEvents = events;
        console.log('Tous les événements:', this.allEvents);
      },
      (error) => {
        console.error('Erreur lors de la récupération des événements', error);
      }
    );
  }

  loadCategories() {
    console.log('Chargement des catégories...');
    this.categoryService.getCategories().subscribe(
      (categories: any) => {
        console.log('Catégories récupérées:', categories);
        this.categories = categories;
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    );
  }

  filterEvents(categoryId: any): void {
    console.log(`Filtrage des événements pour la catégorie ID: ${categoryId}`);
    if (categoryId === 'all') {
      this.loadEvents();  // Recharger tous les événements si "Voir Tous"
    } else {
      this.eventService.getEventsByCategory(categoryId).subscribe(
        (events: Event[]) => {
          console.log(`Événements récupérés pour la catégorie ID: ${categoryId}`, events);
          if (events.length === 0) {
            console.warn(`Aucun événement trouvé pour la catégorie ID: ${categoryId}`);
          }
          this.allEvents = events;

          const sortedByTicketQuantity = events.sort((a, b) => b.ticket_quantity - a.ticket_quantity);
          this.featuredEvents = sortedByTicketQuantity.slice(0, 3);

          const today = new Date();
          this.newEvents = events
            .filter((event) => {
              const eventDate = new Date(event.date);
              const oneWeekAgo = new Date(today);
              oneWeekAgo.setDate(today.getDate() - 7);
              return eventDate >= oneWeekAgo;
            })
            .slice(0, 8);
        },
        (error) => {
          console.error('Erreur lors du filtrage des événements par catégorie', error);
        }
      );
    }
  }

}
