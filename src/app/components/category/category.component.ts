import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, combineLatestWith, debounceTime, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { CategoryService, CategoryVm } from 'src/app/services/category.service';



@Component({
  selector: 'app-category',
  template: `
    <h2>Categories</h2>
    {{vm$|async|json}}
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
    
    this.vm$ = this.vm$;
  }
  
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
