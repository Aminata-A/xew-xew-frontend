import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { WalletService } from 'src/app/services/wallet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Event } from 'src/app/services/interfaces';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-form-event-edit',
  templateUrl: './form-event-edit.component.html',
  styleUrls: ['./form-event-edit.component.scss'],
  providers: [EventService, CategoryService, WalletService],
  standalone: true,
  imports:[ReactiveFormsModule, CommonModule, HeaderComponent, SidebarComponent]
})
export class FormEventEditComponent implements OnInit {
  eventForm!: FormGroup;
  categories: any[] = [];
  wallets: any[] = [];
  selectedCategories: number[] = [];
  selectedWallets: number[] = [];
  errorMessage: string = '';
  bannerPreview: string | null = null;
  eventId!: number;
  isLoggedIn: boolean = false;

  public event!: Event;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private walletService: WalletService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadEvent();
    this.loadCategories();
    this.loadWallets();
  }

  initializeForm() {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      ticket_price: ['', Validators.required],
      ticket_quantity: ['', Validators.required],
      description: [''],
      banner: [null]
    });
  }

  loadEvent() {
    this.eventService.getEvent(this.eventId).subscribe(
      (response: any) => {
        this.event = response.event;
        if (!this.event) {
          console.error("Événement non trouvé.");
          return;
        }
        this.eventForm.patchValue({
          name: this.event.name,
          date: this.event.date,
          time: this.event.time,
          location: this.event.location,
          ticket_price: this.event.ticket_price,
          ticket_quantity: this.event.ticket_quantity,
          description: this.event.description,
          banner: this.event.banner ? this.event.banner : null,
        });
        this.selectedCategories = this.event.categories ? this.event.categories.map((cat: any) => cat.id) : [];
        this.selectedWallets = this.event.wallets ? this.event.wallets.map((wallet: any) => wallet.id) : [];
      },
      (error: HttpErrorResponse) => {
        console.error("Erreur lors du chargement de l'événement :", error);
        this.errorMessage = "Impossible de charger les données de l'événement.";
      }
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

  onUpdate() {
    if (this.eventForm.invalid) {
      return;
    }

    const formData = new FormData();
    this.addFormFieldsToFormData(formData);

    this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: (response) => {
        this.router.navigate(['/events']);
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erreur lors de la mise à jour de l'événement:", error);
        this.errorMessage = "Une erreur est survenue lors de la mise à jour de l'événement.";
      }
    });
  }

  addFormFieldsToFormData(formData: FormData) {
    formData.append('name', this.eventForm.get('name')?.value);
    formData.append('date', this.eventForm.get('date')?.value);
    formData.append('time', this.eventForm.get('time')?.value);
    formData.append('location', this.eventForm.get('location')?.value);
    formData.append('ticket_price', this.eventForm.get('ticket_price')?.value);
    formData.append('ticket_quantity', this.eventForm.get('ticket_quantity')?.value);
    formData.append('description', this.eventForm.get('description')?.value);

    this.selectedCategories.forEach((categoryId) => formData.append('categories[]', categoryId.toString()));
    this.selectedWallets.forEach((walletId) => formData.append('wallets[]', walletId.toString()));

    const bannerFile = this.eventForm.get('banner')?.value;
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
  }

  isSelectedCategory(categoryId: number): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  isSelectedWallet(walletId: number): boolean {
    return this.selectedWallets.includes(walletId);
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

  onBannerUpload(event: any) {
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
}
