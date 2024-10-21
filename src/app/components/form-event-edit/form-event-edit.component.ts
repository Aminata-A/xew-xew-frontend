import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { WalletService } from 'src/app/services/wallet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-form-event-edit',
  templateUrl: './form-event-edit.component.html',
  styleUrls: ['./form-event-edit.component.scss'],
  providers: [EventService, CategoryService, WalletService],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent, SidebarComponent]
})
export class FormEventEditComponent implements OnInit {
  eventForm!: FormGroup;
  currentStep: number = 1;
  categories: any[] = [];
  wallets: any[] = [];
  selectedCategories: number[] = [];
  selectedWallets: number[] = [];
  errorMessage: string = '';
  eventId!: number;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private walletService: WalletService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];  // Récupérer l'ID de l'événement

    // Initialisation du formulaire avec validation
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      ticket_price: ['', Validators.required],
      ticket_quantity: ['', Validators.required],
      description: [''],
      banner: ['']
    });

    // Chargement des données de l'événement, des catégories et des wallets
    this.loadEvent();
    this.loadCategories();
    this.loadWallets();
  }

  // Charger les données de l'événement
  loadEvent() {
    this.eventService.getEvent(this.eventId).subscribe(
      (event: any) => {
        this.eventForm.patchValue(event);
        this.selectedCategories = event.categories.map((cat: any) => cat.id);
        this.selectedWallets = event.wallets.map((wallet: any) => wallet.id);
      },
      (error: HttpErrorResponse) => console.error('Erreur lors du chargement de l\'événement :', error)
    );
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

  isSelectedCategory(categoryId: number): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  onWalletChange(event: any, walletId: number) {
    if (event.target.checked) {
      this.selectedWallets.push(walletId);
    } else {
      this.selectedWallets = this.selectedWallets.filter(id => id !== walletId);
    }
  }

  isSelectedWallet(walletId: number): boolean {
    return this.selectedWallets.includes(walletId);
  }

  onUpdate() {
    if (this.eventForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }

    const formData = new FormData();
    formData.append('body', JSON.stringify({
      'name': this.eventForm.get('name')?.value,
      'date': this.eventForm.get('date')?.value,
      'time': this.eventForm.get('time')?.value,
      'location': this.eventForm.get('location')?.value,
      'ticket_price': this.eventForm.get('ticket_price')?.value,
      'ticket_quantity': this.eventForm.get('ticket_quantity')?.value,
      'description': this.eventForm.get('description')?.value,
    }));

    formData.append('categories', JSON.stringify(this.selectedCategories));
    formData.append('wallets', JSON.stringify(this.selectedWallets));

    const bannerFile = this.eventForm.get('banner')?.value;
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: (response) => {
        console.log('Événement mis à jour avec succès:', response);
        this.router.navigate(['/events']).then(() => {
          window.location.reload();
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors de la mise à jour de l\'événement:', error);
        this.errorMessage = 'Une erreur est survenue lors de la mise à jour de l\'événement.';
      }
    });
  }

  onBannerUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.eventForm.patchValue({
        banner: file
      });
      this.eventForm.get('banner')?.updateValueAndValidity();
    }
  }

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }
}
