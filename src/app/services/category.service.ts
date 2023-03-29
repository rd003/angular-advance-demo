import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatestWith, delay, distinctUntilChanged, map, Observable, of, startWith, switchMap, throwError } from 'rxjs';
import { Category } from 'src/models/category.model';

export interface pagination{
  totalPages: number[],
  page: number,
  pageLimit:number
}
export interface CategoryVm{
  categories: Category[],
  searchCriteria:string,
  loading: boolean,
  error: any | null,
  pagination:pagination
}

let _state: CategoryVm = {
  categories: [],
  searchCriteria:'',
  loading: true,
  error: null,
  pagination: {
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
   state$ = this.categoryState.asObservable();

  private categories$ = this.state$.pipe(map(
    x => x.categories
  ),
    distinctUntilChanged()
  );

  private loading$ = this.state$.pipe(map(
    x => x.loading
  ),
    distinctUntilChanged()
  );

  private error$ = this.state$.pipe(map(
    x => x.error
  ),
    distinctUntilChanged()
  );

  private searchCriteria$ = this.state$.pipe(
    map(
    x => x.searchCriteria
  ),
    distinctUntilChanged()
  );

  private pagination$ = this.state$.pipe(map(
    x => x.pagination
  ),
    distinctUntilChanged()
  );

  private vm$ = this.categories$.pipe(
    combineLatestWith(
      this.searchCriteria$,
      this.loading$,
      this.error$,
      this.pagination$
    ),
    map(([categories, searchCriteria, loading, error, pagination]) => (
      { categories, searchCriteria, loading, error, pagination }
    )
    ));
  
  constructor(private http:HttpClient) { 
    this.searchCriteria$.pipe(
      combineLatestWith(this.pagination$),
      switchMap(([searchCriteria, pagintation]) => (
        this.getCategories(searchCriteria, pagintation).pipe(
          map(categoriesResponse => {
            // new state with pagination
            const newState = this.mapCategoriesResponse(categoriesResponse);
            // ⚠️⚠️⚠️⚠️⚠️getting error on updating state here,why???⚠️⚠️⚠️⚠️⚠️
            this._updateState(newState);
            return newState;
          }),
          catchError(error => {
            const newState: CategoryVm = { ..._state,loading:false, error: error }
            this._updateState(newState);
            return of(newState);
          }),
        )
      ))
    ).subscribe()
  }

  // getStateSnapshot() {
  //   return { ..._state };
  // }

  // http call
  private getCategories(searchCriteria: string, pagination:pagination): Observable<{categories:Category[],totalRecords:number
  }>{
      const url = this.buildCategoryUrl(searchCriteria, pagination.page, pagination.pageLimit);
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

  // private methods

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

  private mapCategoriesResponse=(categoriesResponse: {categories:Category[],totalRecords:number})=>{
    const totalRecords = categoriesResponse.totalRecords;
    const pages = Math.ceil(totalRecords / _state.pagination.pageLimit);
    const totalPages = Array(pages).fill(0).map((x, i) => i + 1);
    const newState = {
      ..._state, loading: false, categories: categoriesResponse.categories
    };
    return newState;
  }

  private _updateState = (state: CategoryVm) => {
    _state = { ...state };
    this.categoryState.next(state);
    console.log(_state);
  }

}






