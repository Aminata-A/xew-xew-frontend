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

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      },
    },
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public responseMessage: string = '';

  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  private http = inject(HttpClient);

  constructor(private qrcode: NgxScannerQrcodeService) {}

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((response: any) => {
      // Vous pouvez démarrer le scanner ici si nécessaire, par exemple avec :
      // this.handle(this.action, 'start');
    });
  }

  public onEvent(e: ScannerQRCodeResult[]): void {
    if (e.length) {
      const qrCodeData = e[0].value; // Capture le contenu du QR code
      this.validateTicket(qrCodeData); // Appel de la fonction de validation
    }
  }

  public validateTicket(qrCodeData: string) {
    // Envoi d'une requête au backend pour validation du ticket
    this.http.post(`http://127.0.0.1:8000/api/tickets/scan/${qrCodeData}`, {})
      .subscribe(
        (response: any) => {
          this.responseMessage = 'Ticket validé avec succès !'; // Message de succès
          Swal.fire({
            title: 'Succès!',
            text: this.responseMessage,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          console.log('Response:', response);
        },
        (error: any) => {
          this.responseMessage = 'Erreur : ce ticket a déjà été scanné ou est invalide.'; // Message d'erreur
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: this.responseMessage,
            footer: '<a href="#">Pourquoi ai-je ce problème?</a>'
          });
          console.error('Error:', error);
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
