import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [EventService],
  standalone: true,
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  event: any = {};
  statistics: any = {}; // Déclaration pour `statistics`
  ticketHolders: any[] = [];
  durationSincePublication: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.params['id'];
    this.loadEventDashboard(eventId);
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
  // Fonction pour obtenir le type de portefeuille
  getWalletType(type: string): string {
    switch (type) {
      case 'orange_money':
        return 'Orange Money';
      case 'free_money':
        return 'Free Money';
      case 'wave':
        return 'Wave';
      default:
        return 'Autre';
    }
  }

  // Fonction pour naviguer vers le composant de scan
  navigateToScan() {
    this.router.navigate(['/scan']);
  }

  loadCharts() {
    this.loadSalesChart();
    this.loadTransactionsChart();
  }

  loadSalesChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Ventes',
            data: [100, 150, 200, 250, 300, 400],
            backgroundColor: 'rgba(73, 210, 250, 0.2)',
            borderColor: '#49D2FA',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  loadTransactionsChart() {
    const ctx = document.getElementById(
      'transactionsChart'
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Orange Money', 'Free Money', 'Wave'],
        datasets: [
          {
            data: [100, 75, 50],
            backgroundColor: ['#FF7900', '#C81A19', '#49D2FA'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  goBack() {
    this.router.navigate(['/my-events']);
  }
}
