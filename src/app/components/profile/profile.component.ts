import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Register } from 'src/app/services/interfaces';
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
  user: Register = {
    name: '',
    email: '',
    password: '', // Valeur par défaut
    password_confirmation: '', // Valeur par défaut
    phone: '',
    role: '',
    photo: null, // Image de profil par défaut
  };
  token: string = ''; // Token JWT
  profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('jwt_token') || ''; // Récupérer le token JWT
    if (this.token) {
      this.getUserProfile(); // Récupérer le profil de l'utilisateur connecté
    }
  }

  // Récupérer les informations de l'utilisateur connecté
  getUserProfile() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`, // Ajouter le token JWT pour l'authentification
    });

    this.http.get<Register>('http://127.0.0.1:8000/api/auth/user-profile', { headers }).subscribe(
      (profile: Register) => {
        this.user = { ...this.user, ...profile }; // Mettez à jour `user` avec les informations de l'API
        if (this.user.photo) {
          this.profileImage = this.user.photo; // Utiliser l'image de profil si elle existe
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
      }
    );
  }

  // Méthode pour mettre à jour le profil utilisateur
  onSubmit() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`, // Ajouter le token JWT pour l'authentification
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
