import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable, throwError } from 'rxjs';
import { Category } from 'src/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = "http://localhost:3000/categories";

  public getCategories(searchCriteria: string, currentPage = 1, pageLimit = 5): Observable<{categories:Category[],totalRecords:number
}>{
    const url = this.buildCategoryUrl(searchCriteria, currentPage, pageLimit);
    return this.http.get(url,{observe:'response'})
      .pipe(
           delay(500),
        map(response => {
              const totalRecords= parseInt(response.headers.get('X-Total-Count')||"0",10);
              const categories= response.body as Category[];
              return { categories,totalRecords };
            })
           )
  }
  
  constructor(private http:HttpClient) { 
   
  }


  private buildCategoryUrl(searchCriteria:string='',currentPage=1,pageLimit=5) {
    let params= new HttpParams()
      .set('_page',currentPage.toString())
      .set('_limit',pageLimit.toString());
    // add a new parameter to url if searchCriterial is not empty or null
  
    if(searchCriteria){
      params=params.set('q',searchCriteria)
    }
    
    const url= `${this.apiUrl}?${params.toString()}`;
    return url;
  }
  
}

