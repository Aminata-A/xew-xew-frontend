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
  currentStep: number = 1;
  categories: any[] = [];
  wallets: any[] = [];
  selectedCategories: number[] = [];
  selectedWallets: number[] = [];
  errorMessage: string = ''; // Propriété pour afficher les erreurs

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private walletService: WalletService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Initialisation du formulaire avec validation
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      ticket_price: ['', Validators.required],
      ticket_quantity: ['', Validators.required],
      description: [''],
      banner: ['', Validators.required] // Nouveau champ pour l'URL de la bannière
    });

    // Chargement des catégories et des wallets disponibles
    this.loadCategories();
    this.loadWallets();
  }

  // Chargement des catégories depuis le service
  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (data: any) => this.categories = data,
      (error: any) => console.error('Erreur lors du chargement des catégories:', error)
    );
  }

  // Chargement des wallets depuis le service
  loadWallets() {
    this.walletService.getWallets().subscribe(
      (data: any) => this.wallets = data,
      (error: any) => console.error('Erreur lors du chargement des wallets:', error)
    );
  }

  // Gestion de la sélection des catégories
  onCategoryChange(event: any, categoryId: number) {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
  }

  // Gestion de la sélection des wallets
  onWalletChange(event: any, walletId: number) {
    if (event.target.checked) {
      this.selectedWallets.push(walletId);
    } else {
      this.selectedWallets = this.selectedWallets.filter(id => id !== walletId);
    }
  }

  // Méthode pour soumettre le formulaire
  onSubmit() {
    if (this.eventForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }

    const formData = {
      ...this.eventForm.value,
      categories: this.selectedCategories,
      wallets: this.selectedWallets
    };

    // Appel au service pour créer l'événement
    this.eventService.createEvent(formData).subscribe({
      next: (response) => {
        console.log('Événement créé avec succès:', response);
        this.router.navigate(['/events']).then(() => {
          window.location.reload();
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors de la création de l\'événement:', error);
        this.errorMessage = 'Une erreur est survenue lors de la création de l\'événement.';
      }
    })
  }

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }
}
