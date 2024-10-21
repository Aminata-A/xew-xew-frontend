import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Register } from 'src/app/services/interfaces'; // Assurez-vous que Register est correctement défini
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProfileComponent implements OnInit {
  user!: Register; // Stocker les informations de l'utilisateur connecté
  token: string = ''; // Stocker le token JWT
  profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740'; // Image par défaut

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken') || ''; // Récupérer le token JWT
    if (this.token) {
      this.getUserProfile(); // Récupérer le profil de l'utilisateur connecté
    }
  }

  // Récupérer les informations de l'utilisateur connecté
  getUserProfile() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}` // Ajouter le token JWT pour l'authentification
    });

    console.log('Appel API pour récupérer le profil utilisateur'); // Ajout de log
    this.http.get<Register>('http://127.0.0.1:8000/api/auth/user-profile', { headers }).subscribe(
      (profile: Register) => {
        console.log('Profil utilisateur reçu:', profile); // Affiche les données récupérées
        this.user = profile; // Stocker le profil utilisateur
        if (this.user.photo) {
          this.profileImage = this.user.photo; // Mettre à jour l'image de profil si elle existe
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur :', error); // Affiche les erreurs
      }
    );
  }


  // Méthode pour mettre à jour le profil utilisateur
  onSubmit() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}` // Ajouter le token JWT pour l'authentification
    });

    this.http.put(`http://127.0.0.1:8000/api/auth/user-profile`, this.user, { headers }).subscribe(
      (response) => {
        console.log('Profil mis à jour avec succès', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du profil :', error);
      }
    );
  }
}
