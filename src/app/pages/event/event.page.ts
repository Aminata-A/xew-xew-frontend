import { CategoryComponent } from 'src/app/components/category/category.component';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { EventCardComponent } from 'src/app/components/event-card/event-card.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/services/interfaces';
import { NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: true,
  imports: [SidebarComponent, EventCardComponent, CategoryComponent, NgFor, HeaderComponent, NgIf],
})
export class EventPage implements OnInit {
  featuredEvents: Event[] = [];  // À la une
  newEvents: Event[] = [];       // Nouveaux événements
  allEvents: Event[] = [];       // Tous les événements
  categories: any[] = [];        // Ajout pour les catégories
  token: string | null = null;   // Variable pour le token
  isLoggedIn: boolean = false;

  // public isAuthenticated: boolean = false;


  constructor(
    private eventService: EventService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Vérifier la connexion de l'utilisateur
    const token = localStorage.getItem('jwt_token');
    this.isLoggedIn = !!token; // Met à jour l'état de connexion

      this.loadEvents();
      this.loadCategories();

  }



  loadEvents() {
    // console.log('Chargement des événements...');
    this.eventService.getEvents().subscribe(
      (events: Event[]) => {
        // console.log('Événements récupérés:', events);

        // Obtenir la date actuelle
        const today = new Date();

        // Filtrer les événements à venir
        const upcomingEvents = events
          .filter(event => new Date(event.date) >= today) // Ne garder que les événements futurs
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Trier par date croissante

        // Section des événements à la une (3 premiers)
        this.featuredEvents = upcomingEvents.slice(0, 3);

        // Section des nouveaux événements (derniers 7 jours parmi les événements futurs)
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);

        this.newEvents = upcomingEvents
          .filter(event => new Date(event.date) >= oneWeekAgo)
          .slice(0, 8); // Limite de 8 nouveaux événements

        // Tous les événements à venir
        this.allEvents = upcomingEvents;
        // console.log('Tous les événements à venir:', this.allEvents);
      },
      (error) => {
        console.error('Erreur lors de la récupération des événements', error);
      }
    );
}


  loadCategories() {
    // console.log('Chargement des catégories...');
    this.categoryService.getCategories().subscribe(
      (categories: any) => {
        // console.log('Catégories récupérées:', categories);
        this.categories = categories;
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    );
  }
  filterEvents(categoryId: any): void {
    if (categoryId === 'all') {
      this.loadEvents();
    } else {
      this.eventService.getEventsByCategory(categoryId).subscribe(
        (events: Event[]) => {
          const today = new Date();
          const upcomingEvents = events.filter(event => new Date(event.date) >= today);
          this.allEvents = upcomingEvents;
          this.featuredEvents = upcomingEvents.slice(0, 3);
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(today.getDate() - 7);
          this.newEvents = upcomingEvents.filter(event => new Date(event.date) >= oneWeekAgo).slice(0, 8);
        },
        (error) => {
          console.error('Erreur lors du filtrage des événements par catégorie', error);
        }
      );
    }
  }

}
