import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray,Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.scss'],
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, ReactiveFormsModule],
})
export class FormEventComponent implements OnInit {
  eventForm!: FormGroup;
  categories: any[] = [];
  wallets: any[] = [];
  selectedCategories: number[] = [];
  selectedWallets: number[] = [];
  errorMessage: string = '';
  bannerPreview: string | null = null;
  successMessage: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private walletService: WalletService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.addTicketType(); // Ajout initial d'un type de billet
    this.loadCategories();
    this.loadWallets();
    this.checkLoginStatus();
}


initializeForm() {
  this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      banner: [null, Validators.required],
      ticket_types: this.fb.array([]) // Tableau requis pour types de tickets
  });
}



  // Méthode pour obtenir le tableau de tickets
  get ticketTypes(): FormArray {
    return this.eventForm.get('ticket_types') as FormArray;
  }

  // Méthode pour ajouter un ticket au tableau
  addTicketType() {
    const ticketGroup = this.fb.group({
      type: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
    this.ticketTypes.push(ticketGroup);
  }

  // Méthode pour supprimer un ticket du tableau
  removeTicketType(index: number) {
    this.ticketTypes.removeAt(index);
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (data: any) => this.categories = data,
      (error: any) => console.error('Erreur lors du chargement des catégories:', error)
    );
  }

  loadWallets() {
    this.walletService.getWallets().subscribe(
      (data: any) => this.wallets = data,
      (error: any) => console.error('Erreur lors du chargement des wallets:', error)
    );
  }

  checkLoginStatus() {
    const token = localStorage.getItem('jwt_token');
    this.isLoggedIn = !!token;
  }

  onCategoryChange(event: any, categoryId: number) {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
  }

  onWalletChange(event: any, walletId: number) {
    if (event.target.checked) {
      this.selectedWallets.push(walletId);
    } else {
      this.selectedWallets = this.selectedWallets.filter(id => id !== walletId);
    }
  }

  onSubmit() {
    if (this.eventForm.invalid) {
        this.errorMessage = 'Le formulaire est invalide. Veuillez vérifier les champs suivants :';
        const controls = this.eventForm.controls;

        Object.keys(controls).forEach(field => {
            const control = controls[field];
            if (control.invalid) {
                this.errorMessage += `\n- ${field}`;
            }
        });
        return;
    }

    // Affichage des données pour vérification
    console.log('Form data:', this.eventForm.value);

    const formData = new FormData();
    const eventData = {
        name: this.eventForm.get('name')?.value,
        date: this.eventForm.get('date')?.value,
        time: this.eventForm.get('time')?.value,
        location: this.eventForm.get('location')?.value,
        description: JSON.stringify(this.eventForm.get('description')?.value),
        ticket_types: this.ticketTypes.value,
        categories: this.selectedCategories,
        wallets: this.selectedWallets
    };
    formData.append('body', JSON.stringify(eventData));

    const bannerFile = this.eventForm.get('banner')?.value;
    if (bannerFile) {
        formData.append('banner', bannerFile);
    }

    this.eventService.createEvent(formData).subscribe({
        next: (response) => {
            this.successMessage = 'Événement créé avec succès';
            this.clearMessagesAfterDelay();
            this.router.navigate(['/events']).then(() => window.location.reload());
        },
        error: (error: HttpErrorResponse) => {
            this.handleError(error);
        }
    });
}

  onBannerUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.eventForm.patchValue({ banner: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.bannerPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 422 && error.error.errors) {
      this.errorMessage = 'Erreurs de validation :';
      const validationErrors = error.error.errors as Record<string, string[]>;
      for (const [field, messages] of Object.entries(validationErrors)) {
        this.errorMessage += `\n${field} : ${messages.join(', ')}`;
      }
    } else {
      this.errorMessage = 'Une erreur est survenue lors de la création de l\'événement.';
    }
    this.clearMessagesAfterDelay();
  }

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }
}
