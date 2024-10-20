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

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {} // Injecter le Router

  login() {
    console.log('Tentative de connexion avec', this.loginData);

    // Réinitialisation du message d'erreur avant la tentative de connexion
    this.errorMessage = null;

    this.authService.login(this.loginData).subscribe(
      (response) => {
        console.log('Réponse reçue du serveur', response);
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
          this.router.navigate(['/events']).then(() => {
            console.log('Redirection réussie vers /events');
            window.location.reload(); // Rechargement de la page après redirection
          }).catch(err => {
            console.error('Erreur lors de la redirection:', err);
          });
        } else {
          this.errorMessage = 'Connexion échouée, aucun token reçu.';
        }
      },
      (error) => {
        console.error('Erreur de connexion', error);
        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else {
          this.errorMessage = 'Erreur de connexion. Veuillez réessayer plus tard.';
        }
      }
    );
  }
}
