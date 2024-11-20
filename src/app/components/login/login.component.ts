import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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

  login(form: NgForm) {
    if (form.invalid) {
      form.controls['email'].markAsTouched();
      form.controls['password'].markAsTouched();
      return;
    }

    // Réinitialisation des messages d'erreur
    this.errorMessage = null;

    this.authService.login(this.loginData).subscribe(
      (response) => {
        console.log('Réponse reçue du serveur', response);
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
          this.router.navigate(['/events']).then(() => {
            console.log('Redirection réussie vers /events');
            window.location.reload(); // Rechargement de la page après redirection
          });
        }
      },
      (error) => {
        console.error('Erreur de connexion', error);

        // Gérer les erreurs de validation (422)
        if (error.status === 422) {
          const validationErrors = error.error.erreurs;
          if (validationErrors.email) {
            this.errorMessage = validationErrors.email;
          } else if (validationErrors.password) {
            this.errorMessage = validationErrors.password;
          }
        }

        // Gérer les autres erreurs (401, etc.)
        if (error.status ) {
          this.errorMessage = error.error.erreur || 'Email ou mot de passe incorrect.';
        }
        // } else {
        //   this.errorMessage = 'Erreur de connexion. Veuillez réessayer plus tard.';
        // }
      }
    );
  }

}
