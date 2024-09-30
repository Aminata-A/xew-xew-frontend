import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnInit, input } from '@angular/core';
import { pipe } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/services/interfaces';
@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class EventCardComponent  {
  @Input() public variant!: number;
  @Input() public event!: Event;
  constructor() {}
}
