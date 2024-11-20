import { Routes } from '@angular/router';
import { EventDetailsComponent } from './components/event-details/event-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full',
  },
  // Routes pour les composants de details evenement
  {
    path: 'event-details/:id',
    component: EventDetailsComponent
  },

  // Route pour la connection
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },

  //  Route pour l'inscription
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },

  // Route pour le profil
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },

  // Route pour les événements
  {
    path: 'events',
    loadComponent: () => import('./pages/event/event.page').then( m => m.EventPage)
  },

  // Route pour les details de l'evenement
  {
    path: 'event-details',
    loadComponent: () => import('./components/event-details/event-details.component').then(m => m.EventDetailsComponent)
  },

  // Route pour le formulaire d'ajout d'evenement
  {
    path: 'form-event',
    loadComponent: () => import('./components/form-event/form-event.component').then(m => m.FormEventComponent)
  },

  // Route pour voir les événements de l'utilisateur
  {
    path: 'my-events',
    loadComponent: () => import('./components/my-events/my-events.component').then( m => m.MyEventsComponent)
  },

  // Route pour le formulaire de mise à jour d'evenement
  {
    path: 'form-event-edit/:id',
    loadComponent: () => import('./components/form-event-edit/form-event-edit.component').then( m => m.FormEventEditComponent)
  },

  // Route pour les tickets
  {
    path: 'tickets',
    loadComponent: () => import('./components/tickets/tickets.component').then(m => m.TicketsComponent)
  },

  // Route pour les details des tickets
  {
    path: 'tickets/:id',
    loadComponent: () => import('./components/ticket-details/ticket-details.component').then(m => m.TicketDetailsComponent)
  },

  // Route pour le scan de ticket
  {
    path: 'scan',
    loadComponent: () => import('./components/scan/scan.component').then(m => m.ScanComponent)
  },

  // Route pour la liste des catégories
  {
    path: 'category',
    loadComponent: () => import('./components/category/category.component').then(m => m.CategoryComponent)
  },

  //  Route pour la liste des wallets
  {
    path: 'wallet',
    loadComponent: () => import('./components/wallet-list/wallet-list.component').then(m => m.WalletListComponent)
  },

  // Route pour le dashboard
  {
    path: 'event-dashboard/:id',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

];
