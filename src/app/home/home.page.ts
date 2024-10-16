import { SidebarComponent } from './../components/sidebar/sidebar.component';
import { TicketsComponent } from './../components/tickets/tickets.component';
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
import { ProfileComponent } from '../components/profile/profile.component';
import { tick } from '@angular/core/testing';
import { WalletCreateComponent } from '../components/wallet-create/wallet-create.component';
import { MyEventsComponent } from '../components/my-events/my-events.component';
// import { SidebarComponent } from '../components/sidebar/sidebar.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, NgFor, EventCardComponent, TicketCardComponent, TransactionComponent, RegisterComponent, LoginComponent, ProfileComponent, TicketsComponent, WalletCreateComponent, SidebarComponent, MyEventsComponent],
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
    this.ticketservice.getUserTickets().subscribe({
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
