import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { WalletService } from 'src/app/services/wallet.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.scss'],
  providers: [EventService, CategoryService, WalletService],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent, HeaderComponent]
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

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private walletService: WalletService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      ticket_price: ['', Validators.required],
      ticket_quantity: ['', Validators.required],
      description: [''],
      banner: ['', Validators.required]
    });
    this.loadCategories();
    this.loadWallets();
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
      this.errorMessage = 'Le formulaire est invalide. Veuillez vérifier les champs.';
      return;
    }


    const formData = new FormData();
    // Les données principales de l'événement sous forme de JSON pour "body"
    formData.append('body', JSON.stringify({
      name: this.eventForm.get('name')?.value,
      date: this.eventForm.get('date')?.value,
      time: this.eventForm.get('time')?.value,
      categories: this.selectedCategories,
      wallets: this.selectedWallets,
      location: this.eventForm.get('location')?.value,
      ticket_price: this.eventForm.get('ticket_price')?.value,
      ticket_quantity: this.eventForm.get('ticket_quantity')?.value,
      description: this.eventForm.get('description')?.value,
    }));

    // Les catégories et wallets sous forme de tableau JSON
    // formData.append('categories', JSON.stringify(this.selectedCategories));
    // formData.append('wallets', JSON.stringify(this.selectedWallets));

    // Charger le fichier de bannière
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

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000); // Efface les messages après 5 secondes
  }
}
