import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket.service';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous d'utiliser jwtDecode pour décoder le token JWT
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  providers: [TicketService], // Ajoutez votre service ici
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, NgFor, CommonModule],
})
export class TicketsComponent implements OnInit {
  tickets: any[] = []; // Liste des tickets de l'utilisateur
  message: string = ''; // Message à afficher si aucun ticket n'est trouvé ou autre
  isAuthenticated: boolean = false; // Indiquer si l'utilisateur est authentifié ou non
  user: any = null; // Stocker les informations de l'utilisateur connecté
  ticketId!: number;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwt_token'); // Récupérer le token JWT depuis le localStorage
    // console.log('JWT Token:', token); // Vérifier si le token est bien récupéré
    this.ticketId = +this.route.snapshot.paramMap.get('id')!;
    // Utilisez ticketId pour charger les détails du ticket
    // console.log('Ticket ID:', this.ticketId);

    if (token) {
      try {
        // Décoder le token JWT pour extraire les informations de l'utilisateur
        const decodedToken: any = jwtDecode(token);
        this.isAuthenticated = true; // Utilisateur authentifié
        this.user = decodedToken; // Stocker les informations de l'utilisateur
        // console.log('Utilisateur connecté :', this.user); // Afficher l'utilisateur connecté

        // Charger les tickets après avoir décodé le token
        this.loadUserTickets();
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT:', error); // Afficher l'erreur
        this.message = 'Token invalide. Veuillez vous reconnecter.';
        this.isAuthenticated = false;
      }
    } else {
      // console.log('Token non trouvé, utilisateur non authentifié.'); // Log si aucun token n'est trouvé
      this.message = 'Vous devez être authentifié pour voir vos tickets.';
      this.isAuthenticated = false;
    }
  }

  // Charger les tickets de l'utilisateur connecté
  loadUserTickets(): void {
    // console.log("Chargement des tickets pour l'utilisateur:", this.user.id); // Log pour voir si l'utilisateur est bien chargé

    this.ticketService.getUserTickets().subscribe(
      (response) => {
        // console.log("Réponse de l'API tickets:", response); // Afficher la réponse de l'API
        this.tickets = response.tickets; // Stocker les tickets dans le tableau
        // console.log('Structure des tickets:', this.tickets); // Vérifiez si chaque ticket a un ID
        if (this.tickets.length === 0) {
          // console.log('Aucun ticket trouvé.'); // Log si aucun ticket n'est trouvé
          this.message = "Vous n'avez pas encore acheté de tickets. Merci.";
        } else {
          // console.log('Tickets chargés avec succès:', this.tickets); // Log les tickets si trouvés
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des tickets:', error); // Afficher l'erreur si la requête échoue
        if (error.status === 401) {
          this.message = 'Vous devez être authentifié pour voir vos tickets.';
        } else {
          this.message = 'Erreur lors du chargement des billets.';
        }
      }
    );
  }

  // Fonction pour naviguer vers les détails d'un ticket
  goToTicketDetails(ticketId: number): void {
    // console.log("Naviguer vers les détails du ticket avec l'ID:", ticketId);
    this.router.navigate(['/tickets', ticketId]).then((success) => {
      if (success) {
        window.location.reload();

        // console.log('Navigation réussie vers les détails du ticket.');
      } else {
        console.error(
          'Erreur lors de la navigation vers les détails du ticket.'
        );
      }
    });
  }
}
