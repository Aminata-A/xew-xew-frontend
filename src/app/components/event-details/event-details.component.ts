import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/services/interfaces';
import { EventService } from 'src/app/services/event.service'; // Import EventService
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  standalone: true,
  imports: [NgIf, CommonModule, IonicModule, PurchaseModalComponent],
})
export class EventDetailsComponent implements OnInit {
  public event!: Event;
  public ticketAvailable: number = 0;
  public quantity: number = 1;
  public totalAmount: number = 0;
  public presentingElement!: HTMLElement | undefined;
  similarEvents: any[] = []; // Store similar events
  public pageWidth!: number;
  public onDesktop = false;
  public currentPageNumber: number = 0;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private eventService: EventService // Inject the EventService
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    this.pageWidth = window.innerWidth;
    if(this.pageWidth >= 768){
      this.onDesktop = true
    }
    console.log(this.onDesktop);
    if (eventId) {
      this.fetchEvent(Number(eventId));
    }

    if (this.event && this.event.categories) {
      this.loadSimilarEvents(this.event.categories);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.pageWidth = window.innerWidth;
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

  public setPage(page: number = 0) {
    console.log('Page number:', page);
    this.currentPageNumber = page;
  }

   // Method to load similar events based on categories
  loadSimilarEvents(categories: number[]) {
    this.eventService.getEventsByCategories(categories).subscribe(
      (response) => {
        this.similarEvents = response;
      },
      (error) => {
        console.error('Error fetching similar events', error);
      }
    );
  }

  // isAuthenticated() {
  //   return !!localStorage.getItem('jwt_token');
  // }


  close(){
    this.modalController.dismiss();
  }
}
