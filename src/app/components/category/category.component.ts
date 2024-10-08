import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [CategoryService],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class CategoryComponent implements OnInit {
  categories: any[] = []; // Liste des catégories
  newCategory: string = ''; // Nom de la nouvelle catégorie
  editCategoryData: any = null; // Données de la catégorie en cours d'édition
  isAuthenticated: boolean = false; // Vérifie si l'utilisateur est authentifié
  errorMessage: string = ''; // Message d'erreur s'il y en a

  constructor(private categoryService: CategoryService, private authService: AuthService) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est authentifié
    this.checkAuthentication();

    // Récupérer les catégories
    this.getCategories();
  }

  // Récupérer la liste des catégories disponibles
  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    );
  }

  // Vérifier si l'utilisateur est authentifié
  checkAuthentication(): void {
    const token = localStorage.getItem('jwt_token');
    this.isAuthenticated = !!token; // Si le token existe, l'utilisateur est authentifié
  }

  // Créer une nouvelle catégorie
  createCategory(): void {
    if (this.newCategory.trim() === '') {
      this.errorMessage = 'Le nom de la catégorie est requis';
      return;
    }

    const data = { label: this.newCategory };
    this.categoryService.createCategory(data).subscribe(
      (response) => {
        this.categories.push(response); // Ajouter la nouvelle catégorie à la liste
        this.newCategory = ''; // Réinitialiser le champ de saisie
        this.errorMessage = ''; // Réinitialiser le message d'erreur
      },
      (error) => {
        console.error('Erreur lors de la création de la catégorie', error);
        this.errorMessage = 'Erreur lors de la création de la catégorie';
      }
    );
  }

  // Démarrer la modification d'une catégorie
  editCategory(category: any): void {
    this.editCategoryData = { ...category }; // Copier la catégorie pour la modification
  }

  // Mettre à jour une catégorie
  updateCategory(): void {
    if (!this.editCategoryData) return;

    this.categoryService.updateCategory(this.editCategoryData, this.editCategoryData.id).subscribe(
      (response) => {
        const index = this.categories.findIndex((c) => c.id === response.id);
        if (index > -1) {
          this.categories[index] = response; // Mettre à jour la catégorie dans la liste
        }
        this.editCategoryData = null; // Réinitialiser le formulaire d'édition
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la catégorie', error);
      }
    );
  }

  // Supprimer une catégorie
  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe(
      () => {
        this.categories = this.categories.filter((category) => category.id !== id); // Supprimer la catégorie de la liste
      },
      (error) => {
        console.error('Erreur lors de la suppression de la catégorie', error);
      }
    );
  }

  // Annuler l'édition en cours
  cancelEdit(): void {
    this.editCategoryData = null;
  }
}
