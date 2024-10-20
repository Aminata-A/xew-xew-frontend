import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router'; // Ajout de la dépendance Router pour la navigation

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  formData = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: '',
    photo: ''  // URL pour la photo de profil
  };

  verificationCode: string = '';
  emailSent: boolean = false;
  emailVerified: boolean = false;
  additionalInfoProvided: boolean = false;
  token: string = '';
  countdown: number = 300;
  countdownMinutes: number = 5;
  countdownSeconds: number = 0;
  timer: any;
  errorMessage: string = '';
  emailExists: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Envoyer le code de vérification email
  sendVerificationEmail(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = 'Veuillez entrer un email valide.';
      return;
    }

    this.authService.verifyEmail(this.formData.email).subscribe(
      (response) => {
        if (response.exists) {
          if (response.type === 'registered') {
            // L'utilisateur est déjà enregistré (registered)
            this.emailExists = true;
            this.errorMessage = 'Cet email est déjà associé à un compte enregistré. Voulez-vous vous connecter ?';
          } else {
            // L'utilisateur n'est pas enregistré (peut être un utilisateur anonyme)
            this.emailExists = true;
            this.errorMessage = 'Cet email est déjà associé à un autre compte. Veuillez contacter le support.';
          }
        } else {
          this.emailSent = true;
          this.errorMessage = '';
          this.startCountdown();
        }
      },
      (error) => {
        this.errorMessage = 'Erreur lors de l\'envoi du code de vérification.';
      }
    );
  }


  // Démarrer le compte à rebours
  startCountdown() {
    this.timer = setInterval(() => {
      this.countdown--;
      this.countdownMinutes = Math.floor(this.countdown / 60);
      this.countdownSeconds = this.countdown % 60;

      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.errorMessage = 'Le temps pour entrer le code a expiré.';
      }
    }, 1000);
  }

  // Rediriger vers la page de connexion
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Vérifier le code de vérification email
  verifyCode(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = 'Veuillez entrer le code de vérification.';
      return;
    }

    if (this.countdown > 0) {
      this.authService.verifyCode(this.formData.email, this.verificationCode).subscribe(
        (response) => {
          if (response.message === 'Code verified successfully') {
            this.emailVerified = true;
            this.token = response.token;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Code de vérification invalide ou expiré.';
          }
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la vérification du code.';
        }
      );
    } else {
      this.errorMessage = 'Le temps pour entrer le code a expiré.';
    }
  }

  // Soumettre les informations supplémentaires (nom, téléphone, rôle, photo)
  submitAdditionalInfo(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.additionalInfoProvided = true;
  }

  // Soumettre le formulaire d'inscription avec le mot de passe
  register(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = 'Veuillez remplir tous les champs et confirmer le mot de passe.';
      return;
    }

    if (this.formData.password !== this.formData.password_confirmation) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.authService.register(this.formData, this.token).subscribe(
      (response) => {
        this.router.navigate(['/login']);  // Redirection vers la page de connexion
      },
      (error) => {
        this.errorMessage = 'Erreur d\'inscription, veuillez vérifier les données fournies.';
      }
    );
  }
}
