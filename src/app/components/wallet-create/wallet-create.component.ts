import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-wallet-create',
  templateUrl: './wallet-create.component.html',
  styleUrls: ['./wallet-create.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class WalletCreateComponent {
  walletData = {
    name: '',
    wallet_number: Math.floor(100000 + Math.random() * 900000), // Generates a random identifier,
    identifier: '',
    balance: 0
  };

  walletNames = ['WAVE', 'ORANGE_MONEY', 'FREE_MONEY']; // Options for wallet names
  message: string = '';

  constructor(private walletService: WalletService) {}

  createWallet(): void {
    this.walletService.createWallet(this.walletData).subscribe(
      (response) => {
        this.message = 'Portefeuille créé avec succès';
        console.log('Success', response);
      },
      (error) => {
        this.message = 'Erreur lors de la création du portefeuille';
        console.error('Error', error);
      }
    );
  }
}
