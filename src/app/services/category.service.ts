import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Category } from 'src/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl="http://localhost:3000/categories";
  private categorySubject:BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);

  fetchCategories(){
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap(categories=>this.categorySubject.next(categories))
    );
  }

  getCategories():Observable<Category[]>{
    if(this.categorySubject.getValue().length===0){
      this.fetchCategories();
    }
    return this.categorySubject.asObservable();
  }

  getCategoryById(id:string){
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }


  addCategory(category:Category):Observable<Category>{
    return this.http.post<Category>(this.apiUrl,category).pipe(
      tap(category=>{
        const categories=this.categorySubject.getValue();
        categories.push(category);
        this.categorySubject.next(categories);
      })
    )
  }

  updateCategory(id:string,category:Category):Observable<Category>{
    return this.http.put<Category>(`${this.apiUrl}/${id}`,category).pipe(
      tap(category=>{
        const categories= this.categorySubject.getValue();
        const index= categories.findIndex(a=>a.id==category.id);
        if(index!==-1){
          categories[index]=category;
          this.categorySubject.next(categories);
        }
      })
    )
  }

  deleteCategory(id:string){
    return this.http.delete<never>(`${this.apiUrl}/${id}`).pipe(
      tap(_=>{
         const categories= this.categorySubject.getValue();
         const index= categories.findIndex(a=>a.id==id);
         if(index!==-1){
          categories.splice(index,1);
          this.categorySubject.next(categories); 
         }
      })
    )
  }

  constructor(private http:HttpClient) { }
}
