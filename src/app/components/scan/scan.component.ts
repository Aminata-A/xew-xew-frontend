import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
  ScannerQRCodeSelectedFiles,
  NgxScannerQrcodeModule,
} from 'ngx-scanner-qrcode';
import { SafePipe } from "./safe.pipe";
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
  imports: [
    FormsModule,
    NgxScannerQrcodeModule,
    CommonModule,
    SafePipe
  ],
  standalone: true,
})
export class ScanComponent implements AfterViewInit {
  private isScanning: boolean = false; // Ajout du drapeau isScanning
  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public responseMessage: string = '';

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      },
    },
  };



  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  private http = inject(HttpClient);

  constructor(private qrcode: NgxScannerQrcodeService) {}

  // Fonction appelée lorsque le composant est chargé
  ngAfterViewInit(): void {
    this.action.isReady.subscribe((response: any) => {
      // Commencez automatiquement le scan si nécessaire
      this.handle(this.action, 'start');
    });
  }

  // Fonction appelée lorsque le composant est deconnecté
  public onEvent(e: ScannerQRCodeResult[]): void {
    if (e.length && !this.isScanning) { // Vérifie si isScanning est false
      const qrCodeData = e[0].value;
      this.isScanning = true; // Active le drapeau pour bloquer d'autres scans
      Swal.fire({
        title: 'Validation du ticket...',
        text: 'Veuillez patienter pendant la validation.',
        timer: 2000,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      this.validateTicket(qrCodeData);
    }
  }

  
  public validateTicket(qrCodeData: string) {
    this.http.post(`http://127.0.0.1:8000/api/tickets/scan/${qrCodeData}`, {})
      .subscribe(
        (response: any) => {
          if (response.ticket.is_paid || response.ticket.price === 0) {
            this.responseMessage = 'Ticket validé avec succès !';
            Swal.fire({
              title: 'Succès!',
              text: this.responseMessage,
              icon: 'success',
              confirmButtonText: 'OK'
            });
          } else {
            this.responseMessage = 'Erreur : ce ticket n\'a pas encore été payé.';
            Swal.fire({
              icon: 'warning',
              title: 'Ticket non payé!',
              text: this.responseMessage,
              confirmButtonText: 'Compris'
            });
          }
          this.isScanning = false; // Réinitialise isScanning après la réponse
        },
        (error: any) => {
          this.responseMessage = 'Erreur : ce ticket a déjà été scanné ou est invalide.';
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: this.responseMessage,
            footer: '<a href="#">Pourquoi ai-je ce problème?</a>'
          });
          this.isScanning = false; // Réinitialise isScanning en cas d'erreur
        }
      );
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label)));
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe(
        (r: any) => console.log(fn, r),
        alert
      );
    } else {
      action[fn]().subscribe(
        (r: any) => console.log(fn, r),
        alert
      );
    }
  }

  public onDowload(action: NgxScannerQrcodeComponent) {
    action.download().subscribe(console.log, alert);
  }

  public onSelects(files: any) {
    this.qrcode.loadFiles(files, 80, 100).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
    });
  }


}
