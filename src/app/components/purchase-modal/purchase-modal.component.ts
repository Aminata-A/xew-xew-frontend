import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class PurchaseModalComponent implements OnInit {
  @Input() event!: any;
  @Input() quantity!: number;
  totalAmount!: number;
  purchaseForm!: FormGroup; // Formulaire pour utilisateurs non connectés

  isAuthenticated: boolean = false; // Vérification si l'utilisateur est connecté
  userName: string = '';
  userEmail: string = '';
  token: string | null = '';

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder // FormBuilder pour le formulaire réactif
  ) {}

  ngOnInit() {
    this.totalAmount = this.event.ticket_price * this.quantity;

    // Initialisation du formulaire si l'utilisateur n'est pas connecté
    this.purchaseForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.token = localStorage.getItem('auth_token'); // Récupérer le token

    if (this.token) {
      // Si un token est trouvé, on récupère le profil de l'utilisateur
      this.authService.getUserProfile(this.token).subscribe(
        (userData) => {
          this.isAuthenticated = true;
          this.userName = userData.name;
          this.userEmail = userData.email;
        },
        (error) => {
          this.isAuthenticated = false;
        }
      );
    }
  }

  close() {
    this.modalController.dismiss();
  }

  confirmPurchase() {
    const purchaseData = {
      event_id: this.event.id,
      quantity: this.quantity,
      name: this.isAuthenticated ? this.userName : this.purchaseForm.get('name')?.value,
      email: this.isAuthenticated ? this.userEmail : this.purchaseForm.get('email')?.value,
    };

    // Envoi de la requête au backend
    const headers = this.token
      ? new HttpHeaders({ Authorization: `Bearer ${this.token}` })
      : new HttpHeaders();

    this.http.post('http://127.0.0.1:8000/api/tickets', purchaseData, { headers }).subscribe(
      (response) => {
        console.log('Achat confirmé :', response);
        this.close();
      },
      (error) => {
        console.error('Erreur lors de la confirmation de l\'achat :', error);
      }
    );
  }
}
