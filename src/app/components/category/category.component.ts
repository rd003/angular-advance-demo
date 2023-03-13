import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, tap } from 'rxjs';
import { CategoryService, CategoryState } from 'src/app/services/category.service';
import { Category } from 'src/models/category.model';

@Component({
  changeDetection:ChangeDetectionStrategy.OnPush,
  selector: 'app-category',
  template: `
    <div class="container">
    <h3>Categories</h3>
    <ng-container *ngIf="vm$|async as vm">
    Search for:
     <input type="text" [formControl]="searchTerm" />
      <table class="table table-bordered table-striped my-2">
        <thead>
          <tr>
             <th>Id</th>
             <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let category of vm.categories">
              <td>{{category.id}}</td>
              <td>{{category.name}}</td>
          </tr>
        </tbody>
      </table>

      <!-- paginator -->
      <nav aria-label="Page navigation example">
       <ul class="pagination">
          <li class="page-item"><a class="page-link" href="#">Previous</a></li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">Next</a></li>
       </ul>
      </nav>

    </ng-container>
    </div>
  `,
  styles: [
  ]
})
export class CategoryComponent implements OnInit {
  vm$:Observable<CategoryState>=this.categoryService.vm$;
  searchTerm!:FormControl;

  constructor(private categoryService:CategoryService){
    const {searchCriteria}=this.categoryService.getStateSnapshot();
    this.searchTerm=this.categoryService.buildSearchTermControl();
    this.searchTerm.patchValue(searchCriteria,{emitEvent:false});
  }

  ngOnInit(): void {
  }



}
