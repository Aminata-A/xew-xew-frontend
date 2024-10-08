import { Register } from './../../services/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { TicketService } from 'src/app/services/ticket.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { TicketService } from './ticket.service'; // Import du service
// import { AuthService } from '../auth/auth.service'; // Import du service Auth pour récupérer l'utilisateur connecté

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  message: string = ''; // Message si aucun ticket n'est trouvé
  user: any = null; // Informations de l'utilisateur connecté
  defaultProfileImage = 'assets/default-avatar.png'; // Image de profil par défaut

  constructor(private ticketService: TicketService, private authService: AuthService) {}
  ngOnInit(): void {
    const token = localStorage.getItem('jwt_token'); // Récupérer le token depuis le localStorage
    if (token) {
      this.authService.getUserProfile(token).subscribe(
        (response: Register) => {
          this.user = response; // Stocker les informations de l'utilisateur
          this.loadUserTickets(); // Charger les tickets après avoir récupéré le profil utilisateur
        },
        (error) => {
          console.error('Erreur lors de la récupération du profil', error);
        }
      );
    } else {
      this.message = 'Token non trouvé. Veuillez vous connecter.';
    }

  }








  // Récupérer les tickets de l'utilisateur connecté
  loadUserTickets(): void {
    this.ticketService.getUserTickets().subscribe(
      (response) => {
        this.tickets = response.tickets;
        if (this.tickets.length === 0) {
          this.message = 'Aucun billet trouvé pour cet utilisateur.';
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des tickets :', error);
        this.message = 'Erreur lors du chargement des billets.';
      }
    );
  }

  // // Récupérer les informations de l'utilisateur connecté
  // getUserProfile(): void {
  //   this.authService.getUserProfile().subscribe(
  //     (response) => {
  //       this.user = response.name;
  //     },
  //     (error) => {
  //       console.error('Erreur lors du chargement du profil utilisateur :', error);
  //     }
  //   );
  // }
}
