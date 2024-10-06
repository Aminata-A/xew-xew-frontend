import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/services/interfaces';
import { EventService } from 'src/app/services/event.service'; // Import EventService
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  standalone: true,
  imports: [NgIf, CommonModule, IonicModule],
})
export class EventDetailsComponent implements OnInit {
  public event!: Event;
  public ticketAvailable: number = 0;
  public quantity: number = 1;
  public totalAmount: number = 0;
  public presentingElement!: HTMLElement | undefined;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private eventService: EventService // Inject the EventService
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.fetchEvent(Number(eventId));
    }

    // Initialize presentingElement
    const ionApp = document.querySelector('ion-app');
    this.presentingElement = ionApp ? ionApp : undefined;
  }

  fetchEvent(id: number) {
    this.eventService.getEvent(id).subscribe(
      (eventData: Event) => {
        this.event = eventData;
        this.ticketAvailable = this.event.ticket_quantity;
      },
      (error) => {
        console.error('Error fetching event data:', error);
      }
    );
  }

  changeQuantity(change: number) {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      this.quantity = newQuantity;
      this.totalAmount = this.quantity * this.event.ticket_price;
    }
  }

  async openPurchaseModal() {
    const modal = await this.modalController.create({
      component: PurchaseModalComponent,
      componentProps: {
        event: this.event,
        quantity: this.quantity
      },
      presentingElement: this.presentingElement
    });
    return await modal.present();
  }
}
