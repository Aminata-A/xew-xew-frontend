import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular'; // Import IonicModule

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule], // Ajouter IonicModule ici aussi
})
export class PurchaseModalComponent {
  @Input() event!: any;
  @Input() quantity!: number;
  totalAmount!: number;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.totalAmount = this.event.ticket_price * this.quantity;
  }

  close() {
    this.modalController.dismiss();
  }
}
