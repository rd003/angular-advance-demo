import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, combineLatestWith, debounceTime, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';



@Component({
  selector: 'app-category',
  template: `
    <h2>Categories</h2>
    <div class="mx-2">
      <input type="text" [formControl]="searchTerm"/>
    </div>
    <ng-container *ngIf="vm$|async as vm">
      <ng-container *ngIf="vm.loading===false;else loadingTemplate">
      <ul>
        <li *ngFor="let category of vm.categories">
          {{category.id}} |
          {{category.name}}
        </li>
      </ul>
      
      <!-- <ul>
        <li *ngFor="let page of vm.pageModel.totalPages">
          <a style="cursor:pointer" (click)="selectPage(page)">{{page}}</a>
        </li>
      </ul> -->

      </ng-container>

      <div *ngIf="vm.error!==null">
             Error on fetching data
      </div>

      <ng-template #loadingTemplate>
             wait...
      </ng-template>
    </ng-container>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
  
export class CategoryComponent implements OnInit {
  vm$!: Observable<CategoryVm>;
  searchTerm = new FormControl();
  
  ngOnInit(): void {
    const searchTerm$: Observable<any> = this.searchTerm.valueChanges.pipe(
      startWith(''),
      debounceTime(400));
    // const xy = this._categoryService.getCategories("").pipe(
    //   combineLatestWith(searchTerm$),
    //   map([categoriesResponse, searchTerm])=> (
         
    //   )
    // )
    
    this.vm$ = searchTerm$.pipe( 
      switchMap(sTerm => {
        return this._categoryService.getCategories(sTerm).pipe(
          map(categoriesResponse => {
            const newState = this.mapCategoriesResponse(categoriesResponse);
            _updateState(newState);
            return newState;
          }),
          catchError(error => {
            const newState:CategoryVm={ ..._state,error:error}
            _updateState(newState);
            return of(newState);
          }),
          startWith(_state)
        )
      })
    );
  };
  
  // selectPage(page: number) {
  //   const newState = {
  //     ..._state, pageModel: {
  //       ..._state.pageModel, page
  //     }
  //   };
  //   console.log(newState.pageModel.page)
  //   _updateState(newState);
  // }


  constructor(private _categoryService:CategoryService) {

  }
   
}
