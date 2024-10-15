import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Register } from 'src/app/services/interfaces';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgIf, FormsModule],  // Importations nécessaires
})
export class HeaderComponent implements OnInit {
  public user!: Register; // Stocker les informations de l'utilisateur connecté
  public token: string = ''; // Le token JWT de l'utilisateur connecté
  profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740';

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
