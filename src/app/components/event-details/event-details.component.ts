import { catchError } from 'rxjs/operators';
import { ModalController, IonicModule, AlertController } from '@ionic/angular';
import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

import { Event } from 'src/app/services/interfaces';
import { EventService } from 'src/app/services/event.service';
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';
import { TicketType } from 'src/app/services/interfaces';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  standalone: true,
  imports: [NgIf, CommonModule, IonicModule, PurchaseModalComponent, FormsModule, NgIf, RouterLink],
})
export class EventDetailsComponent implements OnInit {
  // Propriétés principales du composant
  public event!: Event; // Stockage des détails de l'événement
  public ticketAvailable: number = 0; // Nombre de tickets disponibles
  public quantity: number = 0; // Quantité totale
  public totalAmount: number = 0; // Montant total des achats
  public presentingElement!: HTMLElement | undefined; // Élément modal
  public isAuthenticated: boolean = false; // Statut d'authentification
  public userName: string = ''; // Nom de l'utilisateur
  public userEmail: string = ''; // Email de l'utilisateur
  public pageWidth!: number; // Largeur de la page
  public onDesktop = false; // Indicateur de mode bureau
  public currentPageNumber: number = 0; // Page actuelle
  public paymentUrl: string | null = null; // URL de paiement
  public ticketsRemaining: number = 0; // Tickets restants
  public similarEvents: Event[] = []; // Liste des événements similaires
  public quantities: { [key: string]: number } = {}; // Quantité par type de ticket

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private eventService: EventService,
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {}

  /**
   * Initialisation du composant
   */
  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    this.pageWidth = window.innerWidth;
    this.isAuthenticated = !!localStorage.getItem('jwt_token');

    if (this.isAuthenticated) {
      this.loadUserInfo();
      this.presentAlert(`Bienvenue ${this.userName} (${this.userEmail})`);
    } else {
      this.userName = '';
      this.userEmail = '';
      this.presentAlert("Vous n'êtes pas connecté, veuillez remplir le formulaire.");
    }

    if (this.pageWidth >= 768) {
      this.onDesktop = true;
    }

    if (eventId) {
      this.fetchEvent(Number(eventId));
    }
  }

  /**
   * Gestion de redimensionnement de la fenêtre
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.pageWidth = window.innerWidth;
  }

  /**
   * Récupération des détails de l'événement
   */
  fetchEvent(id: number) {
    this.eventService.getEvent(id).subscribe(
      (response: {
        event: Event;
        ticket_types: { id: string; type: string; price: number; quantity: number }[];
        tickets_remaining: number;
      }) => {
        this.event = response.event;
        this.event.ticket_types = response.ticket_types.map(ticketType => ({
          ...ticketType,
          tickets_available: ticketType.quantity, // Ajout des tickets disponibles
        }));
        this.ticketsRemaining = response.tickets_remaining;

        // Initialiser les quantités de tickets à 1 par défaut
        this.event.ticket_types.forEach(ticketType => {
          this.quantities[ticketType.id] = 1;
        });
      },
      error => {
        console.error("Erreur lors de la récupération des détails de l'événement :", error);
      }
    );
  }

  /**
   * Chargement des événements similaires
   */
  loadSimilarEvents(eventId: number) {
    this.eventService.getSimilarEvents(eventId).subscribe(
      (events: Event[]) => {
        this.similarEvents = events;
      },
      error => {
        console.error("Erreur lors de la récupération des événements similaires :", error);
      }
    );
  }

  /**
   * Chargement des informations de l'utilisateur
   */
  loadUserInfo() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

        // Vérification simple si le token contient une expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.error("Le token a expiré");
          this.isAuthenticated = false;
          localStorage.removeItem('jwt_token');
        } else {
          this.userName = decodedToken?.name || 'Nom indisponible';
          this.userEmail = decodedToken?.email || 'Email indisponible';
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT', error);
        this.isAuthenticated = false;
        localStorage.removeItem('jwt_token');
      }

    } else {
      this.isAuthenticated = false;
    }
  }


  /**
   * Calcul du montant total
   */
  calculateTotalAmount() {
    // Recalculer le montant total en fonction des quantités
    this.totalAmount = this.event.ticket_types.reduce((total, ticketType) => {
      const quantity = this.quantities[ticketType.id] || 0; // Par défaut, 0 si non défini
      return total + ticketType.price * quantity;
    }, 0);
  }


  /**
   * Modification de la quantité de tickets
   */
  changeQuantity(ticketType: { id: string; price: number }, change: number) {
    // Mise à jour des quantités avec limites (1 à 10 tickets)
    const currentQuantity = this.quantities[ticketType.id] || 1;
    const newQuantity = currentQuantity + change;

    if (newQuantity >= 1 && newQuantity <= 10) {
      this.quantities[ticketType.id] = newQuantity;
      this.calculateTotalAmount(); // Recalculer le total
    }
  }

  /**
   * Ouvrir le modal de paiement
   */
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

  /**
   * Passer à une autre page
   */
  public setPage(page: number = 0) {
    this.currentPageNumber = page;
  }

  /**
   * Acheter un ticket
   */
  purchaseTicket() {
    if (!this.isAuthenticated && (!this.userName || !this.userEmail)) {
      alert("Veuillez renseigner votre nom et votre email pour continuer.");
      return;
    }

    const token = localStorage.getItem('jwt_token');

    const ticketData = {
      event_id: this.event.id,
      tickets: this.event.ticket_types.map(ticketType => ({
        ticket_type: ticketType.type,
        quantity: this.quantities[ticketType.id] || 1,
      })),
      name: this.userName,
      email: this.userEmail,
    };

    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    this.http.post('http://127.0.0.1:8000/api/tickets', ticketData, { headers }).subscribe(
      (response: any) => {
        if (response.payment_url) {
          this.paymentUrl = response.payment_url;
        } else {
          alert('Billet(s) acheté(s) avec succès.');
          this.router.navigate(['/tickets']);
        }
      },
      error => {
        console.error("Erreur lors de l'achat", error);
        alert("Une erreur est survenue lors de l'achat du billet.");
      }
    );
  }

  /**
   * Afficher une alerte
   */
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Information',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  /**
   * Mise à jour des informations utilisateur
   */
  updateUserInfo(name: string, email: string) {
    this.userName = name;
    this.userEmail = email;
  }

  /**
   * Fermer le modal
   */
  close() {
    this.modalController.dismiss();
  }

  /**
   * Annuler et revenir à la liste des événements
   */
  cancel() {
    this.router.navigate(['/events']).then(() => {
      window.location.reload();
    });
  }
}
