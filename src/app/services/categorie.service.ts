import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

const baseURL = 'http://127.0.0.1:8000/api';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor() { }

  private http = inject(HttpClient)


  getCategories() {
    return this.http.get(`${baseURL}/categories`);
  }

  getCategory(id: number) {
    return this.http.get(`${baseURL}/categories/${id}`);
  }

  createCategory(data: any) {
    return this.http.post(`${baseURL}/categories`, data);
  }

  updateCategory(id: number, data: any) {
    return this.http.put(`${baseURL}/categories/${id}`, data);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${baseURL}/categories/${id}`);
  }


}
