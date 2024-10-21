import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Register } from 'src/app/services/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; // Pour la redirection
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgIf, FormsModule],
})
export class HeaderComponent implements OnInit {
  public user: Register | null = null; // Stocker les informations de l'utilisateur connecté
  public token: string | null = ''; // Le token JWT de l'utilisateur connecté
  public isAuthenticated: boolean = false; // Savoir si l'utilisateur est connecté
  public showProfileMenu: boolean = false; // Afficher ou masquer le menu du profil
  profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740';
  public message: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // Ajout de ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Récupérer le token depuis le localStorage
    this.token = localStorage.getItem('authToken');
    console.log('Token récupéré:', this.token);

    if (this.token) {
      // Si le token existe, l'utilisateur est authentifié
      this.isAuthenticated = true;
      console.log('Utilisateur authentifié');
      this.getUserProfile();
    } else {
      // Pas de token, l'utilisateur n'est pas connecté
      this.isAuthenticated = false;
      console.log('Utilisateur non authentifié');
    }
  }

  // Récupérer le profil de l'utilisateur connecté
  getUserProfile() {
    if (!this.token) return; // Assurez-vous que le token existe

    console.log('Tentative de récupération du profil utilisateur...');
    this.authService.getUserProfile(this.token).subscribe(
      (profile: Register) => {
        console.log('Profil utilisateur récupéré avec succès:', profile);
        this.user = profile; // Stocker les informations de l'utilisateur
        this.isAuthenticated = true; // Mettre à jour l'état d'authentification
        console.log('Utilisateur authentifié après récupération du profil:', this.isAuthenticated);

        if (this.user.photo) {
          this.profileImage = this.user.photo;
        }

        // Forcer la détection des changements
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
        this.isAuthenticated = false;
      }
    );
  }

  // Afficher ou masquer le menu du profil
  toggleProfileMenu() {
    console.log('Affichage du menu de profil, utilisateur authentifié:', this.isAuthenticated);
    this.showProfileMenu = !this.showProfileMenu;
  }

  // Voir le profil de l'utilisateur
  viewProfile() {
    console.log('Redirection vers le profil, état authentification:', this.isAuthenticated);
    if (this.isAuthenticated) {
      this.router.navigate(['/profile']); // Rediriger vers la page de profil
    } else {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion
    }
    this.showProfileMenu = false;
  }

  // Se déconnecter
  logout() {
    if (!this.token) return; // Assurez-vous que le token existe avant d'essayer de déconnecter

    console.log('Déconnexion...');
    this.authService.logout(this.token).subscribe(
      () => {
        localStorage.removeItem('authToken'); // Supprimer le token du stockage local
        this.isAuthenticated = false;
        console.log('Utilisateur déconnecté, redirection vers la page de login');
        this.router.navigate(['/login']); // Rediriger vers la page de connexion
        this.showProfileMenu = false;
      },
      (error) => {
        console.error('Erreur lors de la déconnexion:', error);
      }
    );
  }

  // Se connecter (redirige vers la page de connexion)
  login() {
    console.log('Redirection vers la page de connexion...');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
    this.showProfileMenu = false;
  }
}
