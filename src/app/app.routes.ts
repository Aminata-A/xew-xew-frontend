import { Routes } from '@angular/router';
import { EventDetailsComponent } from './components/event-details/event-details.component';


export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'event-details/:id', component: EventDetailsComponent },
];
