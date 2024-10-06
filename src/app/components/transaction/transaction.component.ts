import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
  id: string;
  event_name: string;
  event_date: Date;
  event_time: string;
  transaction_amount: number;
}

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TransactionComponent implements OnInit {
  transactions: Transaction[] = []; // Liste des transactions
  selectedTransaction!: Transaction; // Transaction sélectionnée

  constructor() {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  // Charger des transactions fictives
  loadTransactions(): void {
    this.transactions = [
      {
        id: 'TR001',
        event_name: 'Concert de Jazz',
        event_date: new Date('2024-12-25'),
        event_time: '20:30',
        transaction_amount: 25000,
      },
      {
        id: 'TR002',
        event_name: 'Conférence Tech',
        event_date: new Date('2024-11-15'),
        event_time: '09:00',
        transaction_amount: 15000,
      },
      {
        id: 'TR003',
        event_name: 'Festival de Film',
        event_date: new Date('2024-10-10'),
        event_time: '18:00',
        transaction_amount: 20000,
      },
      {
        id: 'TR004',
        event_name: 'Spectacle de Danse',
        event_date: new Date('2024-11-05'),
        event_time: '19:00',
        transaction_amount: 18000,
      }
    ];

    this.selectedTransaction = this.transactions[0]; // Sélectionne la première transaction
  }
}
