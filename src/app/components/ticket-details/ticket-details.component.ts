import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss'],
  standalone: true,
  imports: [CommonModule, QRCodeModule],
})
export class TicketDetailsComponent implements OnInit {
  ticketId!: number;
  ticketDetails: any = null; // Initialiser à null
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ticketId = +this.route.snapshot.paramMap.get('id')!;
    this.loadTicketDetails();
  }

  loadTicketDetails(): void {
    this.ticketService.getTicket(this.ticketId).subscribe(
      (response) => {
        this.ticketDetails = response;
        console.log('Détails du billet :', this.ticketDetails);
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des détails du billet :', error);
        this.errorMessage = 'Erreur lors de la récupération des détails du billet.';
        this.isLoading = false;
      }
    );
  }

  generateQRCodeData(): string {
    if (!this.ticketDetails) return '';
    return JSON.stringify({
      id: this.ticketDetails.ticket_id,
      name: this.ticketDetails.event?.event_name ?? 'Nom non disponible',
      date: this.ticketDetails.event?.event_date ?? 'Date non disponible',
      location: this.ticketDetails.event?.event_location ?? 'Lieu non disponible'
    });
  }
}
