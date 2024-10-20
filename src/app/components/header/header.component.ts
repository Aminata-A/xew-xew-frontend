import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Register } from 'src/app/services/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; // Pour la redirection

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgIf, FormsModule],
})
export class HeaderComponent implements OnInit {
  public user!: Register; // Stocker les informations de l'utilisateur connecté
  public token: string = ''; // Le token JWT de l'utilisateur connecté
  public isAuthenticated: boolean = false; // Savoir si l'utilisateur est connecté
  public showProfileMenu: boolean = false; // Afficher ou masquer le menu du profil
  profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken') || ''; // Récupérer le token
    if (this.token) {
      this.isAuthenticated = true; // Marquer comme authentifié si le token existe
      this.getUserProfile(); // Récupérer le profil utilisateur
    } else {
      this.isAuthenticated = false; // Si pas de token, pas authentifié
    }
  }

  getUserProfile() {
    this.authService.getUserProfile(this.token).subscribe(
      (profile: Register) => {
        this.user = profile; // Stocker les informations de l'utilisateur
        this.isAuthenticated = true; // Mettre à jour l'état après récupération du profil
        if (this.user.photo) {
          this.profileImage = this.user.photo; // Mettre à jour l'image de profil
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
        this.isAuthenticated = false; // En cas d'erreur, marquer comme non authentifié
      }
    );
  }


  // Récupérer le profil de l'utilisateur connecté
  // getUserProfile() {
  //   this.authService.getUserProfile(this.token).subscribe(
  //     (profile: Register) => {
  //       this.user = profile; // Stocker les informations de l'utilisateur
  //       // Mettre à jour l'image de profil s'il y a une image dans les données utilisateur
  //       if (this.user.photo) {
  //         this.profileImage = this.user.photo;
  //       }
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération du profil utilisateur :', error);
  //     }
  //   );
  // }

  // Afficher ou masquer le menu du profil
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  // Voir le profil de l'utilisateur
  viewProfile() {
    if (this.isAuthenticated) {
      this.router.navigate(['/profile']); // Rediriger vers la page de profil
    } else {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion
    }
    this.showProfileMenu = false;
  }

  // Se déconnecter
  logout() {
    this.authService.logout(this.token).subscribe(
      () => {
        localStorage.removeItem('authToken'); // Supprimer le token du stockage local
        this.isAuthenticated = false;
        this.router.navigate(['/login']); // Rediriger vers la page de connexion
        this.showProfileMenu = false;
      },
      (error) => {
        console.error('Erreur lors de la déconnexion :', error);
      }
    );
  }

  // Se connecter (redirige vers la page de connexion)
  login() {
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
    this.showProfileMenu = false;
  }
}
