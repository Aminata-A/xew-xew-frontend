import { Routes } from '@angular/router';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { ProfileComponent } from './components/profile/profile.component';


export const routes: Routes = [
  // {
  //   path: 'home',
  //   loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  // },
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full',
  },
  { path: 'event-details/:id', component: EventDetailsComponent },
  {path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)},
  {path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)},
  {path: 'ticket-card', loadComponent: () => import('./components/ticket-card/ticket-card.component').then(m => m.TicketCardComponent)},
  {path: 'transaction', loadComponent: () => import('./components/transaction/transaction.component').then(m => m.TransactionComponent)},
  {path: 'header', loadComponent: () => import('./components/header/header.component').then(m => m.HeaderComponent)},
  // {path: 'footer', loadComponent: () => import('./components/footer/footer.component').then(m => m.FooterComponent)},
  {path: 'event-card', loadComponent: () => import('./components/event-card/event-card.component').then(m => m.EventCardComponent)},
  {path: 'event-details', loadComponent: () => import('./components/event-details/event-details.component').then(m => m.EventDetailsComponent)},
  {path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)},
  {path: 'tickets', loadComponent: () => import('./components/tickets/tickets.component').then(m => m.TicketsComponent)},
  {path: 'wallet-create', loadComponent: () => import('./components/wallet-create/wallet-create.component').then(m => m.WalletCreateComponent)},
  {path: 'category', loadComponent: () => import('./components/category/category.component').then(m => m.CategoryComponent)},
  {path: 'form-event', loadComponent: () => import('./components/form-event/form-event.component').then(m => m.FormEventComponent)},
  {path: 'sidebar', loadComponent: () => import('./components/sidebar/sidebar.component').then(m => m.SidebarComponent)},
  {
    path: 'events',
    loadComponent: () => import('./pages/event/event.page').then( m => m.EventPage)
  },
  {
    path: 'event-details',
    loadComponent: () => import('./pages/event-details/event-details.page').then( m => m.EventDetailsPage)
  },
  {
    path: 'my-events',
    loadComponent: () => import('./components/my-events/my-events.component').then( m => m.MyEventsComponent)
  }
];
