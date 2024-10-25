import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service'; // Importer le service d'authentification
import { EventCardComponent } from '../event-card/event-card.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [CommonModule,FormsModule, NgFor,AuthService, EventCardComponent, NgIf],
  standalone: true,
  imports: [RouterLink],
})
export class SidebarComponent implements OnInit {
  isLoggedIn: boolean = false;
  profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740'; // Image par défaut
  userName: string = ''; // Stocker le nom de l'utilisateur

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('authToken'); // Récupérer le token du localStorage ou autre
    console.log('Token récupéré:', token); // Vérifier si le token est bien récupéré

    if (token) {
      this.isLoggedIn = true;
      // Si l'utilisateur est connecté, récupérer son image de profil et son nom
      this.authService.getUserProfile(token).subscribe(
        (user) => {
          console.log('Utilisateur récupéré:', user); // Vérifie si l'utilisateur est bien récupéré
          this.profileImage = user.photo ? user.photo : this.profileImage;
          this.userName = user.name;
        },
        (error) => {
          console.error('Erreur lors de la récupération du profil utilisateur', error);
          this.isLoggedIn = false; // Si une erreur se produit, marquer l'utilisateur comme non connecté
        }
      );
    } else {
      console.log('Aucun token trouvé, utilisateur non connecté');
      this.isLoggedIn = false;
    }
  }

  // Méthode pour déconnecter l'utilisateur
  logout() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.authService.logout(token).subscribe(
        () => {
          localStorage.removeItem('authToken'); // Supprimer le token après déconnexion
          this.isLoggedIn = false;
          this.profileImage = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740'; // Réinitialiser l'image de profil
        },
        (error) => {
          console.error('Erreur lors de la déconnexion', error);
        }
      );
    }
  }
}
