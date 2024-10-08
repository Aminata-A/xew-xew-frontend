import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Register } from 'src/app/services/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public user!: Register; // Stocker les informations de l'utilisateur connecté
  public token: string = ''; // Le token JWT de l'utilisateur connecté

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken') || ''; // Récupérer le token depuis le stockage local (ou autre)
    if (this.token) {
      this.getUserProfile();
    }
  }

  // Récupérer le profil de l'utilisateur connecté
  getUserProfile() {
    this.authService.getUserProfile(this.token).subscribe(
      (profile: Register) => {
        this.user = profile; // Stocker les informations de l'utilisateur
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
      }
    );
  }
}
