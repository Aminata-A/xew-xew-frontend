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

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService  // Corrigez ici avec 'private'
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();  // Charger les catégories aussi
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(
      (events: Event[]) => {
        // Trier les événements par ticket_quantity (les plus élevés en premier)
        const sortedByTicketQuantity = events.sort((a, b) => b.ticket_quantity - a.ticket_quantity);

        // Condition pour les événements "À la une" - Les 3 avec le plus de ticket_quantity
        this.featuredEvents = sortedByTicketQuantity.slice(0, 3);

        // Condition pour les nouveaux événements (derniers 7 jours)
        const today = new Date();
        this.newEvents = events
          .filter((event) => {
            const eventDate = new Date(event.date);
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(today.getDate() - 7);
            return eventDate >= oneWeekAgo;
          })
          .slice(0, 8); // Limite de 8 nouveaux événements

        // Tous les événements
        this.allEvents = events;

        console.log('Tous les événements:', this.allEvents);
      },
      (error) => {
        console.error('Erreur lors de la récupération des événements', error);
      }
    );
  }


  loadCategories() {
    this.categoryService.getCategories().subscribe((categories: any) => {
      this.categories = categories;
    });
  }
}
