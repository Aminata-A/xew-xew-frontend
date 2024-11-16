import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Chart } from 'chart.js/auto';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [EventService],
  standalone: true,
  imports: [CommonModule, NgIf],
})
export class DashboardComponent implements OnInit {
  event: any = {};
  statistics: any = {};
  ticketHolders: any[] = [];
  durationSincePublication: string | null = null;
  published_date: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.params['id'];
    this.loadEventDashboard(eventId);
  }
  navigateToScan() {
    this.router.navigate(['/scan']);
  }

  loadEventDashboard(eventId: number) {
    this.eventService.getEventDashboard(eventId).subscribe(
      (data) => {
        this.event = data.event;
        this.statistics = data.statistics;
        this.ticketHolders = data.ticket_holders;
        this.durationSincePublication = data.duration_since_publication;
        this.loadCharts();
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  loadCharts() {
    this.loadTicketChart();
    this.loadScanChart();
  }

  loadTicketChart() {
    const ctx = document.getElementById('ticketChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Tickets Vendus', 'Tickets Restants'],
        datasets: [
          {
            data: [
              this.statistics.tickets_sold,
              this.statistics.tickets_remaining,
            ],
            backgroundColor: ['#FF773D', '#1b1b1b'],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  loadScanChart() {
    const ctx = document.getElementById('scanChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Scannés', 'Non Scannés'],
        datasets: [
          {
            label: 'Statut des Tickets',
            data: [
              this.statistics.scanned_tickets,
              this.statistics.unscanned_tickets,
            ],
            backgroundColor: ['#FF773D', '#1b1b1b'],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  goBack() {
    this.router.navigate(['/my-events']).then(() => {
      window.location.reload(); // Rechargement de la page après redirection
    }).catch(err => {
      console.error('Erreur lors de la redirection:', err);
    });
  }
}
