import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  loginData = {
/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Connexion à l'application
   *
   * @remarks
   * La méthode login envoie une requête de connexion à l'API
   * avec les informations de connexion (email, mot de passe) fournies
   * par l'utilisateur.
   *
   * Si la connexion est réussie, le token JWT est stocké dans le
   * localStorage pour être utilisé ultérieurement.
   *
   * Si une erreur se produit, un message d'erreur est affiché.
   */
/******  7f2895a7-1406-4656-8e00-00df4d644f58  *******/    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.loginData).subscribe(
      (response) => {
        console.log('Connexion réussie', response);
        // Sauvegarder le token JWT dans le localStorage par exemple
        localStorage.setItem('token', response.token);
      },
      (error) => {
        console.error('Erreur de connexion', error);
      }
    );
  }
}
