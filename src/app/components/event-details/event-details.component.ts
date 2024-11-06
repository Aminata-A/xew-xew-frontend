import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/services/interfaces';
import { EventService } from 'src/app/services/event.service';
import { HttpClient } from '@angular/common/http';
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  standalone: true,
  imports: [NgIf, CommonModule, IonicModule, PurchaseModalComponent, FormsModule, NgIf],
})
export class EventDetailsComponent implements OnInit {
  public event!: Event;
  public ticketAvailable: number = 0;
  public quantity: number = 1;
  public totalAmount: number = 0;
  public presentingElement!: HTMLElement | undefined;
  public isAuthenticated: boolean = false;
  public userName: string = '';
  public userEmail: string = '';
  public pageWidth!: number;
  public onDesktop = false;
  public currentPageNumber: number = 0;
  public paymentUrl: string | null = null;
  public ticketsRemaining: number = 0;
  public similarEvents: Event[] = [];

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private eventService: EventService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    this.pageWidth = window.innerWidth;
    this.isAuthenticated = !!localStorage.getItem('jwt_token');

    if (this.isAuthenticated) {
      this.loadUserInfo();
    }

    if (this.pageWidth >= 768) {
      this.onDesktop = true;
    }

    if (eventId) {
      this.fetchEvent(Number(eventId));
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.pageWidth = window.innerWidth;
  }

  fetchEvent(id: number) {
    this.eventService.getEvent(id).subscribe(
      (response: { event: Event; tickets_remaining: number }) => {
        this.event = response.event;
        this.ticketsRemaining = response.tickets_remaining;

        // Appel à loadSimilarEvents uniquement si l'ID de l'événement est défini
        if (this.event.id) {
          this.loadSimilarEvents(this.event.id);
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des détails de l'événement :", error);
      }
    );
  }

  loadSimilarEvents(eventId: number) {
    this.eventService.getSimilarEvents(eventId).subscribe(
      (events: Event[]) => {
        this.similarEvents = events;
      },
      (error) => {
        console.error("Erreur lors de la récupération des événements similaires :", error);
      }
    );
  }

  loadUserInfo() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userName = decodedToken.name || 'Utilisateur Anonyme';
        this.userEmail = decodedToken.email || 'email@exemple.com';
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT', error);
        this.isAuthenticated = false;
        localStorage.removeItem('jwt_token');
      }
    } else {
      this.isAuthenticated = false;
    }
  }

  changeQuantity(change: number) {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      this.quantity = newQuantity;
      this.totalAmount = this.quantity * this.event.ticket_price;
    }
  }

  async openPurchaseModal() {
    if (!this.isAuthenticated && (!this.userName || !this.userEmail)) {
      alert("Veuillez renseigner votre nom et votre email pour continuer.");
      return;
    }

    const modal = await this.modalController.create({
      component: PurchaseModalComponent,
      componentProps: {
        event: this.event,
        quantity: this.quantity,
        userName: this.userName,
        userEmail: this.userEmail,
      },
      presentingElement: this.presentingElement,
    });
    return await modal.present();
  }

  public setPage(page: number = 0) {
    this.currentPageNumber = page;
  }

  purchaseTicket() {
    const token = localStorage.getItem('jwt_token');

    const ticketData = {
      event_id: this.event.id,
      quantity: this.quantity,
      name: this.userName,
      email: this.userEmail,
    };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    this.http.post('http://127.0.0.1:8000/api/tickets', ticketData, { headers }).subscribe(
      (response: any) => {
        console.log('Achat réussi', response);

        if (this.event.ticket_price === 0) {
          alert('Billet acheté avec succès.');
          this.router.navigate(['/tickets']);
        } else {
          this.paymentUrl = response.payment_url;
        }
      },
      (error) => {
        console.error("Erreur lors de l'achat", error);
        alert("Une erreur est survenue lors de l'achat du billet.");
      }
    );
  }

  updateUserInfo(name: string, email: string) {
    this.userName = name;
    this.userEmail = email;
  }

  close() {
    this.modalController.dismiss();
  }

  cancel() {
    this.router.navigate(['/events']).then(() => {
      window.location.reload();
    });
  }
}
