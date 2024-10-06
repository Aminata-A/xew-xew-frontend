import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';

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
  emailSent: boolean = false; // Pour vérifier si l'email a été envoyé
  emailVerified: boolean = false; // Pour vérifier si le code est correct
  additionalInfoProvided: boolean = false; // Pour vérifier si les infos supplémentaires sont fournies
  token: string = ''; // Stocker le token JWT ici
  countdown: number = 300; // Temps de 5 minutes en secondes
  countdownMinutes: number = 5; // Minutes restantes
  countdownSeconds: number = 0; // Secondes restantes
  timer: any; // Référence du timer
  errorMessage: string = ''; // Message d'erreur général
  emailExists: boolean = false; // Pour afficher un message si l'email existe déjà

  constructor(private authService: AuthService) {}

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
          this.errorMessage = ''; // Réinitialiser le message d'erreur
          this.startCountdown(); // Lancer le compte à rebours après l'envoi du code
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
    }, 1000); // Mettre à jour chaque seconde
  }

  verifyCode() {
    console.log('Vérification du code : ', this.verificationCode);
    if (this.countdown > 0) {
      this.authService.verifyCode(this.formData.email, this.verificationCode).subscribe(
        (response) => {
          console.log('Réponse de l\'API lors de la vérification du code : ', response);
          if (response.message === 'Code verified successfully') { // Vérifier le succès
            console.log('Code vérifié avec succès');
            this.emailVerified = true;  // Mettre à jour pour afficher le formulaire
            this.token = response.token;  // Sauvegarder le token reçu
            this.errorMessage = ''; // Réinitialiser les erreurs si le code est correct
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
