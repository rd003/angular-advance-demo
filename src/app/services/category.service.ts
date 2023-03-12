import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Category } from 'src/models/category.model';

export interface CategoryResponse{
  categories:Category[],
  count:number
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl="http://localhost:3000/categories";

  getCategories(page=1,limit=10,searchTerm=''):Observable<CategoryResponse>{
    // const url = `${this.apiUrl}?_page=${page}&_limit=${limit}&name=${searchTerm}`;
    let params= new HttpParams()
                  .set('_page',page.toString())
                  .set('_limit',limit.toString())
    if(searchTerm){
      params=params.set('q',searchTerm)
    }
    const url= `${this.apiUrl}?${params.toString()}`;
   return this.http.get(url,{observe:'response'})
           .pipe(
            map(response=> {
              const count= parseInt(response.headers.get('X-Total-Count')||"0",10);
              const categories= response.body as Category[]
              return {count,categories} as CategoryResponse;
            })
           )
  }


  getCategoryById(id:string){
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  addCategory(category:Category):Observable<Category>{
    return this.http.post<Category>(this.apiUrl,category);
  }

  updateCategory(id:string,category:Category):Observable<Category>{
    return this.http.put<Category>(`${this.apiUrl}/${id}`,category);
  }

  deleteCategory(id:string){
    return this.http.delete<never>(`${this.apiUrl}/${id}`);
  }

  constructor(private http:HttpClient) { 
  }
}
