import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router'; // Ajout de la dépendance Router pour la navigation
import { ChangeDetectorRef } from '@angular/core';

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
  @ViewChild('profilePicInput') profilePicInput!: ElementRef<HTMLInputElement>;
  profilePreview: string | ArrayBuffer | null = null;


  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

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
                if (response.message === 'Code vérifié avec succès') {
                    this.emailVerified = true;  // Change l'état pour débloquer l'étape suivante
                    this.errorMessage = '';
                    this.token = response.token;
                    console.log('Code vérifié, emailVerified:', this.emailVerified);
                    this.cdr.detectChanges(); // Force Angular à mettre à jour l'affichage

                } else {
                    this.errorMessage = 'Code de vérification invalide ou expiré.';
                }
            },
            (error) => {
                this.errorMessage = 'Erreur lors de la vérification du code.';
                console.error('Erreur de vérification:', error);
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
        window.location.reload();
      },
      (error) => {
        this.errorMessage = 'Erreur d\'inscription, veuillez vérifier les données fournies.';
      }
    );
  }
   // Ouvre la boîte de dialogue de sélection de fichier
  openFilePicker() {
    this.profilePicInput.nativeElement.click();
  }

  // Charge et prévisualise l'image sélectionnée
  onProfilePicUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => this.profilePreview = e?.target?.result || null;
      reader.readAsDataURL(file);
    }
  }
}
