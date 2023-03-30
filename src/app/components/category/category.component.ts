import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, catchError, combineLatest, combineLatestWith, debounceTime, EMPTY, map, NEVER, Observable, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CategoryService, CategoryVm } from 'src/app/services/category.service';



@Component({
  selector: 'app-category',
  template: `
   <div class="container">
    <h2>Categories</h2>
    <div class="search-container">
      <input type="text" class="textbox" placeholder="search" [formControl]="searchTerm"/>
    </div>

    <ng-container *ngIf="vm$|async as vm">
      <ng-container *ngIf="vm.loading===false;else loadingTemplate">
      <ul class="category-list">
        <li *ngFor="let category of vm.categories">
          {{category.id}} |
          {{category.name}}
        </li>
      </ul>
      
      <div class="pagination">
        <select [formControl]="pageSize">
           <option *ngFor="let ps of pageSizes" [ngValue]="ps">{{ps}}</option>
        </select>

        <ng-container *ngIf="page$|async as currentSelectedPage">
          <ul>
            <li *ngFor="let page of vm.pagination.totalPages">
              <a style="cursor:pointer" (click)="
              updateCurrentPage(page)" [class]="{'selected-link':page===currentSelectedPage}">{{page}}</a>
            </li>
          </ul>
        </ng-container>
       
      </div>

      </ng-container>

      <div *ngIf="vm.error!==null">
             Error on fetching data
      </div>

      <ng-template #loadingTemplate>
             wait...
      </ng-template>
    </ng-container>
  </div>
  `,
  styles: [
    `
    .container{
      width:500px;
    }

    .pagination {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
    }
    
    .pagination select {
      font-size: 16px;
      padding: 6px 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .pagination ul {
      display: flex;
      flex-direction: row;
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
    
    .pagination li {
      margin: 0 4px;
    }
    
    .pagination li a {
      display: block;
      font-size: 16px;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      text-decoration: none;
      color: #333;
    }

    .selected-link{
      background-color:#a1a0a0;
      color:#000;
    }
    
    .pagination li a:hover {
      background-color: #f5f5f5;
    }

    .category-list{
      margin-top:15px;
      padding:0;
    }

    .category-list li{
      list-style:none;
      background: rgb(248,255,88);
      background: linear-gradient(90deg, rgba(248,255,88,1) 0%, rgba(252,134,255,1) 100%);
      padding:5px;
      border:1px solid #333;
      margin:10px 0px;
      border-radius:8px;
      font-size:16px;
      box-shadow:5px 5px;
    }

    .textbox{
      padding:5px 10px;
      border:1px solid #333;
      border-radius:8px;
      font-size:16px;
      width:100%;
    }
    
   `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
  
export class CategoryComponent implements OnInit,OnDestroy {
  pageSizes = [5, 10, 15, 20];
  searchTerm!: FormControl;
  pageSize!: FormControl;
  page$ = new BehaviorSubject<number>(1);
  vm$!: Observable<CategoryVm>;
  destroy$ = new Subject<boolean>();

  
  ngOnInit(): void {
    this.vm$ = this._categoryService.state$;
    this.searchTerm = new FormControl('');
    this.pageSize = new FormControl(5);

    this.searchTerm.valueChanges.pipe(
      debounceTime(400),
      map(value => 
        this._categoryService.updateSearchCriteria(value)
      ),
      takeUntil(this.destroy$)
    ).subscribe()
   
    const pageSize$ = this.pageSize.valueChanges.pipe(
      startWith(this.pageSize.value)
    )

   // pagination method call
    this.page$.pipe(
      combineLatestWith(pageSize$),
      map(([page, selectedPageLimit]) => {
        //console.log('not reaching here')
        this._categoryService.updatePagination(page, selectedPageLimit);
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }
  
  updateCurrentPage(page: number) {
    this.page$.next(page);
  }

  constructor(private _categoryService:CategoryService) {
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
   
}
