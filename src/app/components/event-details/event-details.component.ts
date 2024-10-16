import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/services/interfaces';
import { EventService } from 'src/app/services/event.service';
import { HttpClient } from '@angular/common/http';
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Import de jwt-decode

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  standalone: true,
  imports: [NgIf, CommonModule, IonicModule, PurchaseModalComponent, FormsModule],
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
  public similarEvents: any[] = [];
  public pageWidth!: number;
  public onDesktop = false;
  public currentPageNumber: number = 0;
  public paymentUrl: string | null = null;

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
    this.isAuthenticated = !!localStorage.getItem('jwt_token'); // Vérifier si l'utilisateur est connecté

    if (this.isAuthenticated) {
      this.loadUserInfo(); // Charger les informations de l'utilisateur à partir du token
    }

    if (this.pageWidth >= 768) {
      this.onDesktop = true;
    }

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

  loadUserInfo() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userName = decodedToken.name || 'Utilisateur Anonyme'; // Extraire le nom du token
        this.userEmail = decodedToken.email || 'email@exemple.com'; // Extraire l'email du token
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT', error);
        this.isAuthenticated = false;
        localStorage.removeItem('jwt_token'); // Supprimer le token corrompu
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
      presentingElement: this.presentingElement
    });
    return await modal.present();
  }

  public setPage(page: number = 0) {
    this.currentPageNumber = page;
  }

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

  // Gérer l'achat de ticket
  purchaseTicket() {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      console.error('Token JWT non disponible');
      alert('Vous devez être connecté pour acheter un billet.');
      return;
    }

    const ticketData = {
      event_id: this.event.id,
      quantity: this.quantity,
      name: this.userName,
      email: this.userEmail
    };

    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.http.post('http://127.0.0.1:8000/api/tickets', ticketData, { headers }).subscribe(
      (response: any) => {
        console.log('Achat réussi', response);

        // Si l'événement est gratuit
        if (this.event.ticket_price === 0) {
          alert('Billet acheté avec succès.');
          this.router.navigate(['/tickets']);
        } else {
          this.paymentUrl = response.payment_url;
        }
      },
      (error) => {
        console.error('Erreur lors de l\'achat', error);
        alert('Une erreur est survenue lors de l\'achat du billet.');
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
}
