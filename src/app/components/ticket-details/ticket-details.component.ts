import { tick } from '@angular/core/testing';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  ticketDetails: any;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du ticket depuis les paramètres de la route
    this.ticketId = +this.route.snapshot.paramMap.get('id')!;

    // Charger les détails du ticket
    this.loadTicketDetails();
  }
  loadTicketDetails(): void {
    this.ticketService.getTicket(this.ticketId).subscribe(
      (response) => {
        this.ticketDetails = response;
        console.log('Détails du billet :', this.ticketDetails);

        // Forcer la détection des changements
        this.cdr.detectChanges();
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des détails du billet :', error);
      }
    );
  }
  generateQRCodeData(): string {
    if (!this.ticketDetails) return '';
    return JSON.stringify({
      id: this.ticketDetails.ticket_id,
      name: this.ticketDetails.event.event_name,
      date: this.ticketDetails.event.event_date,
      location: this.ticketDetails.event.event_location
    });
  }

  navigateToTickets() {
    this.router.navigate(['/tickets']);
  }
}
