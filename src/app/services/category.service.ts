import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'src/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl="http://localhost:3000/categories";

  addCategory(category:Category){
    return this.http.post<Category>(this.apiUrl,category);
  }

  updateCategory(id:string,category:Category){
    return this.http.put<Category>(`${this.apiUrl}/${id}`,category);
  }

  deleteCategory(id:string){
    return this.http.delete<never>(`${this.apiUrl}/${id}`);
  }


  getCategoryById(id:string){
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  getCategories(){
    return this.http.get<Category[]>(this.apiUrl);
  }

  

  constructor(private http:HttpClient) { }
}
