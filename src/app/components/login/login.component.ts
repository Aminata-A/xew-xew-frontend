import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router'; // Import du Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {} // Injecter le Router

  login() {
    console.log('Tentative de connexion avec', this.loginData); // Vérifiez les données envoyées

    this.authService.login(this.loginData).subscribe(
      (response) => {
        console.log('Réponse reçue du serveur', response); // Voir la réponse complète du serveur
        if (response.token) {
          localStorage.setItem('jwt_token', response.token); // Assurez-vous que le token est bien sauvegardé
          this.router.navigate(['/']).then(() => {
            console.log('Redirection réussie vers /events');
          }).catch(err => {
            console.error('Erreur lors de la redirection:', err);
          });
        } else {
          console.error('Aucun token trouvé dans la réponse');
        }
      },
      (error) => {
        console.error('Erreur de connexion', error); // Log de l'erreur de connexion
      }
    );
  }
}
