import { Routes } from '@angular/router';
import { EventDetailsComponent } from './components/event-details/event-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full',
  },
  {
    path: 'event-details/:id',
    component: EventDetailsComponent
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'header',
    loadComponent: () => import('./components/header/header.component').then(m => m.HeaderComponent)
  },
  {
    path: 'event-card',
    loadComponent: () => import('./components/event-card/event-card.component').then(m => m.EventCardComponent)
  },
  {
    path: 'event-details',
    loadComponent: () => import('./components/event-details/event-details.component').then(m => m.EventDetailsComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'tickets',
    loadComponent: () => import('./components/tickets/tickets.component').then(m => m.TicketsComponent)
  },
  {
    path: 'tickets/:id',
    loadComponent: () => import('./components/ticket-details/ticket-details.component').then(m => m.TicketDetailsComponent)
  },
  {
    path: 'wallet-create',
    loadComponent: () => import('./components/wallet-create/wallet-create.component').then(m => m.WalletCreateComponent)
  },
  {
    path: 'category',
    loadComponent: () => import('./components/category/category.component').then(m => m.CategoryComponent)
  },
  {
    path: 'form-event',
    loadComponent: () => import('./components/form-event/form-event.component').then(m => m.FormEventComponent)
  },
  {
    path: 'sidebar',
    loadComponent: () => import('./components/sidebar/sidebar.component').then(m => m.SidebarComponent)
  },
  {
    path: 'wallet',
    loadComponent: () => import('./components/wallet-list/wallet-list.component').then(m => m.WalletListComponent)
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/event/event.page').then( m => m.EventPage)
  },
  {
    path: 'scan',
    loadComponent: () => import('./components/scan/scan.component').then(m => m.ScanComponent)
  },
  {
    path: 'event-dashboard/:id',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'my-events',
    loadComponent: () => import('./components/my-events/my-events.component').then( m => m.MyEventsComponent)
  },

  {
    path: 'form-event-edit/:id',
    loadComponent: () => import('./components/form-event-edit/form-event-edit.component').then( m => m.FormEventEditComponent)
  }
];
