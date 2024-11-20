import { CategorieService } from './../../services/categorie.service';
import { Component, OnInit } from '@angular/core';
import { WalletService } from './../../services/wallet.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet-list',
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class WalletListComponent implements OnInit {
  transactions = [
    {
      eventType: 'Événement',
      eventName: 'Ousmane Ndiaye',
      eventDate: 'Lundi le 25 décembre 2024 à 20h30',
      amount: '25 000 F CFA',
    },
    {
      eventType: 'Événement',
      eventName: 'Aminata Armande Ndiaye',
      eventDate: 'Lundi le 25 décembre 2024 à 20h30',
      amount: '25 000 F CFA',
    },
    {
      eventType: 'Événement',
      eventName: 'Fatim Seck',
      eventDate: 'Lundi le 25 décembre 2024 à 20h30',
      amount: '25 000 F CFA',
    },
  ];

  // Variables for Wallet Management
  walletData = {
    name: '',
    wallet_number: Math.floor(100000 + Math.random() * 900000),
    identifier: '',
    balance: 0,
  };
  showWalletForm = false;
  wallets: any[] = [];
  walletNames = ['WAVE', 'ORANGE_MONEY', 'FREE_MONEY'];
  message: string = '';
  showSuccessMessage = false;
  isLoggedIn: boolean = false;

  // Variables for Category Management
  public showCategoryForm: boolean = false;
  public newCategoryLabel: string = '';
  public categories: any[] = [];

  private token: string = '';

  constructor(
    private walletService: WalletService,
    private categorieService: CategorieService
  ) {}

  // Méthode d'initialisation
  ngOnInit(): void {
    const token = localStorage.getItem('jwt_token');
    this.isLoggedIn = !!token;
    this.token = localStorage.getItem('jwt_token') || '';
    this.loadCategories();

    if (this.token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });

      this.walletService.getWallets().subscribe(
        (data) => {
          this.wallets = data;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des portefeuilles',
            error
          );
        }
      );
    } else {
      console.error('Token JWT non trouvé');
    }
  }

  // Méthode pour créer un portefeuille
  createWallet(): void {
    this.walletService.createWallet(this.walletData).subscribe(
      (response) => {
        this.message = 'Portefeuille créé avec succès';
        this.showSuccessMessage = true;
        this.showWalletForm = false;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      (error) => {
        this.message = 'Erreur lors de la création du portefeuille';
        console.error('Error', error);
      }
    );
  }

  // Méthode pour obtenir la classe CSS du portefeuille en fonction de son nom
  getWalletClass(name: string): string {
    switch (name) {
      case 'WAVE':
        return 'wave-wallet';
      case 'ORANGE_MONEY':
        return 'orange-money-wallet';
      case 'FREE_MONEY':
        return 'free-money-wallet';
      default:
        return 'default-wallet';
    }
  }

  // Méthode pour obtenir l'image de logo du portefeuille en fonction de son nom
  getWalletLogo(name: string): string {
    switch (name) {
      case 'WAVE':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9rYPURKIok7K0ZF22oqFgMbzIHgNCauVQA&s';
      case 'ORANGE_MONEY':
        return 'https://cdn6.aptoide.com/imgs/6/3/7/6371597b91eed2b9a38e9c0fc8808f48_icon.png';
      case 'FREE_MONEY':
        return 'https://pbs.twimg.com/media/E6R2Gb2XIAUi1Ps.jpg';
      default:
        return 'assets/logos/default-logo.png';
    }
  }

  // Méthode pour charger les catégories
  loadCategories(): void {
    this.categorieService.getCategories().subscribe(
      (response: any) => {
        // Vérifiez si la réponse contient un tableau directement ou dans une clé spécifique
        this.categories = Array.isArray(response) ? response : response.data || [];
      },
      (error) => {
        console.error("Erreur lors de la récupération des catégories", error);
        this.categories = []; // Définit categories comme tableau vide en cas d'erreur
      }
    );
  }


  // Créer une nouvelle catégorie
  createCategory(): void {
    if (this.newCategoryLabel.trim() === '') {
      return;
    }

    const categoryData = { label: this.newCategoryLabel };
    this.categorieService.createCategory(categoryData).subscribe(
      (response) => {
        this.categories.push(response);
        this.newCategoryLabel = '';
        this.showCategoryForm = false;
      },
      (error) => {
        console.error('Erreur lors de la création de la catégorie', error);
      }
    );
  }
}
