import { TicketService } from './../services/ticket.service';
import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { EventService } from '../services/event.service';
import { Event } from '../services/interfaces';
import { EventCardComponent } from '../components/event-card/event-card.component';
import { TicketCardComponent } from '../components/ticket-card/ticket-card.component';
import { TransactionComponent } from '../components/transaction/transaction.component';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../services/interfaces';
import { NgFor } from '@angular/common';
import { RegisterComponent } from '../components/register/register.component';
import { LoginComponent } from '../components/login/login.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, NgFor, EventCardComponent, TicketCardComponent, TransactionComponent, RegisterComponent, LoginComponent],
})
export class HomePage {

  private eventservice = inject(EventService);

  private ticketservice = inject(TicketService);

  private transactionservice = inject(TransactionService);


  events: Event[] = <Event[]>[];

  tickets: Event[] = <Event[]>[];

  transactions: Transaction[] = <Transaction[]>[];

  constructor() {
    this.mokEvents();
    this.loadTicket();
    this.loadTransactions();
  }

  mokEvents() {
    this.eventservice.getEvents().subscribe({
      next: (data) => {
        this.events = data;
      }
    });
  }

  loadTicket() {
    this.ticketservice.getTickets().subscribe({
      next: (data) => {
        // this.tickets = data;
      }
    })
  }

  loadTransactions() {
    this.transactionservice.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
      }
    })
  }
}
