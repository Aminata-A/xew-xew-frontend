import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router, RouterLink } from '@angular/router'; // Ajout de la dépendance Router pour la navigation
Router
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
    photo: '',
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

  sendVerificationEmail() {
    console.log('Envoi de l\'email de vérification à : ', this.formData.email);
    this.authService.verifyEmail(this.formData.email).subscribe(
      (response) => {
        console.log('Réponse de l\'API pour l\'envoi du code de vérification : ', response);
        if (response.exists) {
          this.emailExists = true;
          this.errorMessage = 'Cet email est déjà associé à un compte.';
        } else {
          this.emailSent = true;
          this.errorMessage = '';
          this.startCountdown();
        }
      },
      (error) => {
        console.error('Erreur lors de l\'envoi du code de vérification', error);
        this.errorMessage = 'Erreur lors de l\'envoi du code de vérification.';
      }
    );
  }

  startCountdown() {
    this.timer = setInterval(() => {
      this.countdown--;

      this.countdownMinutes = Math.floor(this.countdown / 60);
      this.countdownSeconds = this.countdown % 60;

      if (this.countdown <= 0) {
        clearInterval(this.timer);
        console.log('Temps écoulé pour la vérification du code.');
        this.errorMessage = 'Le temps pour entrer le code a expiré.';
      }
    }, 1000);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  verifyCode() {
    console.log('Vérification du code : ', this.verificationCode);
    if (this.countdown > 0) {
      this.authService.verifyCode(this.formData.email, this.verificationCode).subscribe(
        (response) => {
          console.log('Réponse de l\'API lors de la vérification du code : ', response);
          if (response.message === 'Code verified successfully') {
            console.log('Code vérifié avec succès');
            this.emailVerified = true;
            this.token = response.token;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Code de vérification invalide ou expiré.';
          }
        },
        (error) => {
          console.error('Erreur lors de la vérification du code', error);
          this.errorMessage = 'Erreur lors de la vérification du code.';
        }
      );
    } else {
      this.errorMessage = 'Le temps pour entrer le code a expiré.';
    }
  }


  submitAdditionalInfo() {
    console.log('Soumission des infos supplémentaires : ', this.formData);
    if (!this.formData.name || !this.formData.phone || !this.formData.role) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.additionalInfoProvided = true;
  }

  register() {
    console.log('Soumission du formulaire d\'inscription : ', this.formData);
    if (this.formData.password !== this.formData.password_confirmation) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.authService.register(this.formData, this.token).subscribe(
      (response) => {
        console.log('Inscription réussie', response);
        this.router.navigate(['/login']);  // Redirection vers la page de connexion
      },
      (error) => {
        console.error('Erreur lors de l\'inscription', error);
        this.errorMessage = 'Erreur d\'inscription, veuillez vérifier les données fournies.';
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Fichier sélectionné :', file);
    }
  }
}
