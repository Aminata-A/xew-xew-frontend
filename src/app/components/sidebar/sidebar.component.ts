import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service'; // Importer le service d'authentification
import { EventCardComponent } from '../event-card/event-card.component';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [CommonModule,FormsModule, NgFor,AuthService, EventCardComponent, NgIf],
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule],
})
export class SidebarComponent implements OnInit {
  isLoggedIn: boolean = false;
  profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740'; // Image par défaut
  userName: string = ''; // Stocker le nom de l'utilisateur
  activeMenu: string = ''; // Nouveau : menu actif
  userRole: string = ''; // Nouveau : rôle utilisateur

  constructor(private authService: AuthService) {}

  // Méthode d'initialisation
  ngOnInit() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      this.isLoggedIn = true;
      this.authService.getUserProfile(token).subscribe(
        (user) => {
          this.userRole = user.role; // Récupère le rôle de l'utilisateur
          this.profileImage = user.photo || this.profileImage;
        },
        () => {
          this.isLoggedIn = false; // Si une erreur se produit
        }
      );
    }
  }

  // Méthode pour mettre à jour le menu actif
  setActiveMenu(menu: string) {
    this.activeMenu = menu;
  }

  // Méthode pour se déconnecter
  logout() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.authService.logout(token).subscribe(
        () => {
          localStorage.removeItem('authToken');
          this.isLoggedIn = false;
          this.profileImage = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740';
        },
        (error) => {
          console.error('Erreur lors de la déconnexion', error);
        }
      );
    }
  }
}
