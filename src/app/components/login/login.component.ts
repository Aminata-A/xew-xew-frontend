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
    this.authService.login(this.loginData).subscribe(
      (response) => {
        console.log('Connexion réussie', response);
        if (response.token) {
          localStorage.setItem('jwt_token', response.token); // Assurez-vous que le token est bien sauvegardé
          this.router.navigate(['/home']); // Redirection après la connexion
        } else {
          console.error('Aucun token trouvé dans la réponse');
        }
      },
      (error) => {
        console.error('Erreur de connexion', error);
      }
    );
  }

}
