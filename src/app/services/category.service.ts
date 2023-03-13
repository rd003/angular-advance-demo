import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatestWith, debounceTime, distinctUntilChanged, map, Observable, pipe, switchMap, tap } from 'rxjs';
import { Category } from 'src/models/category.model';

export interface Pagination{
  currentPage:number;
  totalRecords:number;
  totalPages:number;
  selectedPageSize:number;
  pageSizes:number[];
}

export interface CategoryState{
  categories:Category[],
  pagination:Pagination,
  searchCriteria:string,
  loading:boolean
}

let _state:CategoryState={
  categories:[],
  searchCriteria:'',
  loading:false,
  pagination:{
    currentPage:1,
    selectedPageSize:5,
    totalPages:0,
    totalRecords:0,
    pageSizes:[5,10,15,20]
  }
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl="http://localhost:3000/categories";
  private store=new BehaviorSubject<CategoryState>(_state);
  private state$=this.store.asObservable();

  categories$=this.state$.pipe(
    map(state=>state.categories),
    distinctUntilChanged()
    );

  pagination$=this.state$.pipe(
      map(state=>state.pagination),
      distinctUntilChanged()
      );
  searchCriteria$=this.store.pipe(
        map(state=>state.searchCriteria),
        distinctUntilChanged()
        );
  
  loading$= this.state$.pipe(
    map(state=>state.loading)
  )

  // totalRecords$=this.state$.pipe(
  //   map(state=>state.totalRecords)
  // )

  /**
   * Viewmodel that resolves once all the data is ready (or updated)...
   */

  vm$:Observable<CategoryState>=this.pagination$.pipe(
    combineLatestWith(
      this.searchCriteria$,
      this.categories$,
      this.loading$
    ),
    map(([pagination,searchCriteria,categories,loading])=>
    ({pagination,searchCriteria,categories,loading}) //array destructuring
  ));

  
  /**
   * rest api calls
   */

  private getCategories(searchCriteria:string,pagination:Pagination):Observable<Category[]>{
    // const url = `${this.apiUrl}?_page=${page}&_limit=${limit}&name=${searchTerm}`;
    
    const url= this.buildCategoryUrl(searchCriteria,pagination);
    return this.http.get(url,{observe:'response'})
           .pipe(
            map(response=> {
              const totalRecords= parseInt(response.headers.get('X-Total-Count')||"0",10);
              const categories= response.body as Category[];
              const selectedPageSize=_state.pagination.selectedPageSize;
              const totalPages= Math.ceil(totalRecords/selectedPageSize);
              const pagination = {..._state.pagination,totalPages,totalRecords}
              //this.updateState({..._state,pagination})
              return categories;
            }),
            map( filterWithCriteria(searchCriteria))
           )
  }
  
  /**
   * Watch 2 streams to trigger user loads and state updates
   */
 

  constructor(private http:HttpClient) { 
    this.searchCriteria$.pipe(
      combineLatestWith(this.pagination$),
      switchMap(([searchCriteria,pagingation])=>{
        return this.getCategories(searchCriteria,pagingation)
      })
      )
      .subscribe(categories=>{
      this.updateState({..._state,categories,loading:false})
    })
  }

  /**
   *public methods
   */

  // Allows quick snapshot access to data for ngOnInit() purposes
  getStateSnapshot(): CategoryState {
    return { ..._state, pagination: { ..._state.pagination } };
  }

 
  buildSearchTermControl():FormControl{
     const searchTerm=new FormControl();
     const searchTerm$=searchTerm.valueChanges
                               pipe(
                                  debounceTime(300),
                                  distinctUntilChanged()
                                  );
     searchTerm$.subscribe(value=>{
      this.updateSearchCriteria(value);
     });

     return searchTerm;
  }

  updateSearchCriteria(searchCriteria:string){
    this.updateState({..._state,searchCriteria,loading:true})

  }

  updatePagination(selectedSize: number, currentPage: number = 1) {
    const pagination = { ..._state.pagination, currentPage, selectedSize };
    this.updateState({ ..._state, pagination, loading: true });
  }


  /**
   * private methods
   */

  private buildCategoryUrl(searchCriteria:string='',pagination:Pagination) {
    let params= new HttpParams()
      .set('_page',pagination.currentPage.toString())
      .set('_limit',pagination.selectedPageSize.toString());
    // add a new parameter to url if searchCriterial is not empty or null
    /*
    if(searchCriteria){
      params=params.set('q',searchCriteria)
    }
    */
    const url= `${this.apiUrl}?${params.toString()}`;
    return url;
  }

  private updateState(state:CategoryState){
    console.log(state);
    _state=state;
     this.store.next(_state);
  }

  /** This code will not work, i wonder why 🤔 */
  // private updateState(state:CategoryState){
  //    this.store.next(state);
  // }


}

// ******************************************
// Filter Utilities
// ******************************************


function filterWithCriteria(searchCriteria: string) {

  return (categories: Category[]) => {
    if (!searchCriteria) {
      return categories;
    }

    const filteredCategories = categories.filter(category => {
      return category.name.toLowerCase().startsWith(searchCriteria.toLowerCase());
    });

    return filteredCategories;
  };
}