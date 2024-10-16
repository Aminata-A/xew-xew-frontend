import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket.service';
import {jwtDecode} from 'jwt-decode'; // Assurez-vous d'utiliser jwtDecode pour décoder le token JWT
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  providers: [TicketService,], // Ajoutez votre service ici
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, NgFor, CommonModule],
})
export class TicketsComponent implements OnInit {
  tickets: any[] = []; // Liste des tickets de l'utilisateur
  message: string = ''; // Message à afficher si aucun ticket n'est trouvé ou autre
  isAuthenticated: boolean = false; // Indiquer si l'utilisateur est authentifié ou non
  user: any = null; // Stocker les informations de l'utilisateur connecté

  constructor(private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwt_token'); // Récupérer le token JWT depuis le localStorage

    if (token) {
      try {
        // Décoder le token JWT pour extraire les informations de l'utilisateur
        const decodedToken: any = jwtDecode(token);
        this.isAuthenticated = true; // Utilisateur authentifié
        this.user = decodedToken; // Stocker les informations de l'utilisateur
        console.log('Utilisateur connecté :', this.user.id);

        // Charger les tickets après avoir décodé le token
        this.loadUserTickets();

      } catch (error) {
        console.error('Erreur lors du décodage du token JWT', error);
        this.message = 'Token invalide. Veuillez vous reconnecter.';
        this.isAuthenticated = false;
      }
    } else {
      this.message = 'Vous devez être authentifié pour voir vos tickets.';
      this.isAuthenticated = false;
    }
  }

  // Charger les tickets de l'utilisateur connecté
  loadUserTickets(): void {
    this.ticketService.getUserTickets().subscribe(
      (response) => {
        this.tickets = response.tickets; // Stocker les tickets dans le tableau
        if (this.tickets.length === 0) {
          this.message = 'Vous n\'avez pas encore acheté de tickets. Merci.';
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.message = 'Vous devez être authentifié pour voir vos tickets.';
        } else {
          console.error('Erreur lors du chargement des tickets :', error);
          this.message = 'Erreur lors du chargement des billets.';
        }
      }
    );
  }
}
