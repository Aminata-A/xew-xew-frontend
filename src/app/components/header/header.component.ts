import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Register } from 'src/app/services/interfaces';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIf],
})
export class HeaderComponent implements OnInit {
  public showProfileMenu: boolean = false;
  public profileImage: string = 'https://img.freepik.com/vecteurs-premium/icone-utilisateur-orange-sans-icone-arriere-plan_1076610-85993.jpg?w=740';
  public isAuthenticated: boolean = false;
  public user: Register = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: '',
    photo: null,
  };
  public token: string = '';
  public title: string = 'Home';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('jwt_token') || ''; // Récupérer le token JWT
    if (this.token) {
      this.isAuthenticated = true;
      this.loadUserProfile(); // Charger le profil utilisateur
    }

    // Détecter les changements de route pour mettre à jour le titre
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateTitleBasedOnRoute();
      }
    });
  }

  updateTitleBasedOnRoute() {
    if (this.router.url.includes('ticket')) {
      this.title = 'Mes Billets';
    } else if (this.router.url.includes('my-events')) {
      this.title = 'Mes evenements';
    } else{
      this.title = 'Home';
    }
    this.cdr.detectChanges(); // Forcer la mise à jour de l'interface
  }

  // Charger les informations de l'utilisateur connecté
  loadUserProfile() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    this.http.get<Register>('http://127.0.0.1:8000/api/auth/user-profile', { headers }).subscribe(
      (profile: Register) => {
        this.user = { ...this.user, ...profile }; // Mettre à jour `user` avec les informations de l'API
        this.profileImage = this.user.photo ? `http://127.0.0.1:8000${this.user.photo}` : this.profileImage;
        this.cdr.detectChanges(); // Mise à jour de l'interface utilisateur
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
        this.isAuthenticated = false;
      }
    );
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    this.cdr.detectChanges(); // Forcer la mise à jour de l'interface
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
    this.showProfileMenu = false;
  }

  login() {
    this.router.navigate(['/login']);
    window.location.reload();
  }

  viewProfile() {
    this.router.navigate(['/profile']);
    this.showProfileMenu = false;
  }
}
