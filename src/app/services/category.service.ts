import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, throwError } from 'rxjs';
import { Category } from 'src/models/category.model';

interface PageModel{
  totalPages: number[],
  page: number,
  pageLimit:number
}
interface CategoryVm{
  categories: Category[],
  loading: boolean,
  error: any | null,
  pageModel:PageModel
}

let _state: CategoryVm = {
  categories: [],
  loading: true,
  error: null,
  pageModel: {
    totalPages: [],
    page: 1,
    pageLimit:5
  }
}



@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = "http://localhost:3000/categories";
  private categoryState: BehaviorSubject<CategoryVm> = new BehaviorSubject(_state);
  private state$ = this.categoryState.asObservable();

  private getCategories(searchCriteria: string, currentPage = 1, pageLimit = 5): Observable<{categories:Category[],totalRecords:number
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

const _updateState=(state:CategoryVm) =>{
  _state = { ...state };
}

 const mapCategoriesResponse=(categoriesResponse: {categories:Category[],totalRecords:number})=>{
  const totalRecords = categoriesResponse.totalRecords;
  const pages = Math.ceil(totalRecords / _state.pageModel.pageLimit);
  const totalPages = Array(pages).fill(0).map((x, i) => i + 1);
  const newState = {
    ..._state, loading: false, categories: categoriesResponse.categories, pageModel:
    {
      ..._state.pageModel,
      totalPages
    }
  };
  return newState;
}

