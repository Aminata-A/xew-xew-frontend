import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
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
  imports: [CommonModule, HeaderComponent, SidebarComponent, ReactiveFormsModule, ],
})
export class FormEventEditComponent implements OnInit {
  eventForm!: FormGroup;
  categories: any[] = [];
  wallets: any[] = [];
  selectedCategories: number[] = [];
  selectedWallets: number[] = [];
  bannerPreview: string | null = null;
  eventId!: number;
  errorMessage: string = '';
  successMessage: string = '';
  isLoggedIn: boolean = false;
  public event!: Event;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private walletService: WalletService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadEvent();
    this.loadCategories();
    this.loadWallets();
    this.isLoggedIn = !!localStorage.getItem('jwt_token');
  }

  initializeForm() {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      ticket_types: this.fb.array([]),
      banner: [null],
    });
  }

  get ticketTypes(): FormArray {
    return this.eventForm.get('ticket_types') as FormArray;
  }

  addTicketType(ticketType: any = { type: '', price: '', quantity: '' }) {
    this.ticketTypes.push(
      this.fb.group({
        type: [ticketType.type, Validators.required],
        price: [ticketType.price, [Validators.required, Validators.min(0)]],
        quantity: [ticketType.quantity, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeTicketType(index: number) {
    this.ticketTypes.removeAt(index);
  }

  loadEvent() {
    this.eventService.getEvent(this.eventId).subscribe(
      (response: any) => {
        const event = response.event;
        this.eventForm.patchValue({
          name: event.name,
          date: event.date,
          time: event.time,
          location: event.location,
          description: event.description,
        });
        this.bannerPreview = event.banner;
        this.selectedCategories = event.categories.map((cat: any) => cat.id);
        this.selectedWallets = event.wallets.map((wallet: any) => wallet.id);
        event.ticket_types.forEach((ticketType: any) => this.addTicketType(ticketType));
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'Erreur lors du chargement de l\'événement.';
      }
    );
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (data: any) => (this.categories = data),
      (error: any) => console.error(error)
    );
  }

  loadWallets() {
    this.walletService.getWallets().subscribe(
      (data: any) => (this.wallets = data),
      (error: any) => console.error(error)
    );
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

  onCategoryChange(event: any, categoryId: number) {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter((id) => id !== categoryId);
    }
  }

  onWalletChange(event: any, walletId: number) {
    if (event.target.checked) {
      this.selectedWallets.push(walletId);
    } else {
      this.selectedWallets = this.selectedWallets.filter((id) => id !== walletId);
    }
  }

  onUpdate() {
    if (this.eventForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement.';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.eventForm.get('name')?.value);
    formData.append('date', this.eventForm.get('date')?.value);
    formData.append('time', this.eventForm.get('time')?.value);
    formData.append('location', this.eventForm.get('location')?.value);
    formData.append('description', this.eventForm.get('description')?.value);
    formData.append('ticket_types', JSON.stringify(this.ticketTypes.value));
    formData.append('categories', JSON.stringify(this.selectedCategories));
    formData.append('wallets', JSON.stringify(this.selectedWallets));

    const banner = this.eventForm.get('banner')?.value;
    if (banner && banner instanceof File) {
      formData.append('banner', banner);
    }

    this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: () => {
        this.successMessage = 'Événement mis à jour avec succès.';
        this.router.navigate(['/events']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors de la mise à jour de l\'événement :', error);
        if (error.status === 422) {
          this.errorMessage = 'Erreur de validation : veuillez vérifier les champs saisis.';
        } else if (error.status === 404) {
          this.errorMessage = 'Événement introuvable ou supprimé.';
        } else if (error.status === 403) {
          this.errorMessage = 'Vous n\'êtes pas autorisé à modifier cet événement.';
        } else {
          this.errorMessage = 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.';
        }
      },
    });
  }


  onCancel() {
    this.router.navigate(['/events']);
  }

  isSelectedCategory(categoryId: number): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  isSelectedWallet(walletId: number): boolean {
    return this.selectedWallets.includes(walletId);
  }
}
