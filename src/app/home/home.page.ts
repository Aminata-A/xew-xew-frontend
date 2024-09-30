import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { EventService } from '../services/event.service';
import { Event } from '../services/interfaces';
import { EventCardComponent } from '../components/event-card/event-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, EventCardComponent],
})
export class HomePage {

  private eventservice = inject(EventService);

  events: Event[] = <Event[]>[];

  constructor() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventservice.getEvents().subscribe({
      next: (data) => {
        this.events = data;
      }
    });
  }
}
