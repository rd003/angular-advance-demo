import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, catchError, combineLatestWith, debounceTime, map, NEVER, Observable, of, startWith, switchMap, tap } from 'rxjs';
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
      
      <ul>
        <li *ngFor="let page of vm.pagination.totalPages">
          <a style="cursor:pointer" (click)="selectPage(page)">{{page}}</a>
        </li>
      </ul>

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
  page$ = new BehaviorSubject<number>(1);
  searchTerm = new FormControl();
  
  ngOnInit(): void {
    const searchCriteria$ = this.searchTerm.valueChanges.pipe(
      startWith(''),
      tap(console.log),
      debounceTime(400)
    )
    
    this.vm$ = this._categoryService.state$;

    searchCriteria$.pipe(
      combineLatestWith(
        this.vm$
      ),
      switchMap(([searchCriteria, vm]) => {
        this._categoryService.updateSearchCriteria(searchCriteria)
        return NEVER
      })
    )
  }
  
  selectPage(page: number) {
    this.page$.next(page);
  }


  constructor(private _categoryService:CategoryService) {

  }
   
}
