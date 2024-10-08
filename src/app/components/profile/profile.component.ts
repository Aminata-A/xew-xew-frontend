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
  user!: Register; // Stocke les informations de l'utilisateur connecté
  token: string = ''; // Stocker le token JWT
  profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740'; // Image par défaut


  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken') || '';
    if (this.token) {
      this.getUserProfile(); // Récupérer le profil de l'utilisateur connecté
    }
  }

  // Récupérer les informations de l'utilisateur connecté
  getUserProfile() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}` // Ajouter le token JWT pour l'authentification
    });

    this.http.get<Register>('http://127.0.0.1:8000/api/auth/user-profile', { headers }).subscribe(
      (profile: Register) => {
        this.user = profile; // Stocker le profil de l'utilisateur
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
      }
    );
  }
}



// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from 'src/app/services/auth.service';
// import { Register } from 'src/app/services/interfaces';

// @Component({
//   selector: 'app-profile',
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.scss'],
//   standalone: true,
//   imports: [CommonModule, FormsModule],
// })
// export class ProfileComponent implements OnInit {
//   user!: Register; // Stocker les informations de l'utilisateur connecté
//   profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740'; // Image par défaut
//   token: string = ''; // Stocker le token JWT

//   constructor(private authService: AuthService) {}

//   ngOnInit(): void {
//     this.token = localStorage.getItem('authToken') || '';
//     if (this.token) {
//       this.getUserProfile();
//     }
//   }

//   // Récupérer les informations de l'utilisateur connecté
//   getUserProfile() {
//     this.authService.getUserProfile(this.token).subscribe(
//       (profile: Register) => {
//         this.user = profile;
//         if (this.user.photo) {
//           this.profileImage = this.user.photo; // Utiliser l'image de profil de l'utilisateur si elle existe
//         }
//       },
//       (error) => {
//         console.error('Erreur lors de la récupération du profil utilisateur :', error);
//       }
//     );
//   }

//   onSubmit() {
//     console.log('Envoi du formulaire de mise à jour du profil : ', this.user);
//     this.authService.updateProfile(this.user, this.token).subscribe(
//       (response) => {
//         console.log('Mise à jour du profil spécie', response);
//       },
//       (error) => {
//         console.error('Erreur lors de la mise à jour du profil', error);
//       }
//     );
//   }
// }
