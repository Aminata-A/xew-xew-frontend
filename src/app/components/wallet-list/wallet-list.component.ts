import { Component, OnInit } from '@angular/core';
import { WalletService } from './../../services/wallet.service';
import { HttpHeaders } from '@angular/common/http'; // Import HttpHeaders if not already
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
    CommonModule,
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

  walletData = {
    name: '',
    wallet_number: Math.floor(100000 + Math.random() * 900000), // Generates a random identifier,
    identifier: '',
    balance: 0,
  };
  showWalletForm = false;

  wallets: any[] = [];
  walletNames = ['WAVE', 'ORANGE_MONEY', 'FREE_MONEY']; // Options for wallet names
  message: string = '';
  showSuccessMessage = false;
  isLoggedIn: boolean = false;

  private token: string = ''; // Token variable for authentication

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {

    const token = localStorage.getItem('jwt_token');
    this.isLoggedIn = !!token; // Met à jour l'état de connexion
    // Retrieve token from local storage
    this.token = localStorage.getItem('jwt_token') || '';

    if (this.token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });

      // Pass the headers with the token to the walletService
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
  createWallet(): void {
    this.walletService.createWallet(this.walletData).subscribe(
      (response) => {
        this.message = 'Portefeuille créé avec succès';
        // Après la création réussie du portefeuille
        console.log('Success', response);

        // Après la création réussie du portefeuille
        this.showSuccessMessage = true;

        // Masquer la modale
        this.showWalletForm = false;
        // Réinitialiser le message de succès après un certain délai
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000); // 3 secondes
      },
      (error) => {
        this.message = 'Erreur lors de la création du portefeuille';
        console.error('Error', error);
      }
    );
  }

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
}
