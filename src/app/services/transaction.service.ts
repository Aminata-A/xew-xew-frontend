import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../services/interfaces';

const baseURL = 'http://127.0.0.1:8000/api';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor() { }
  private HttpClient = inject(HttpClient);


  getTransactions() {
    return this.HttpClient.get<Transaction[]>(`${baseURL}/transactions`);
  }
}
