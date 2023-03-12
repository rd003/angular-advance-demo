import { Component, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/models/category.model';

@Component({
  selector: 'app-category',
  template: `
    <div class="container">
    <h3>Categories</h3>
    <ng-container *ngIf="categories$|async as categories">
      <table class="table table-bordered table-striped my-2">
        <thead>
          <tr>
             <th>Id</th>
             <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let category of categories">
              <td>{{category.id}}</td>
              <td>{{category.name}}</td>
          </tr>
        </tbody>
      </table>
    </ng-container>
    </div>
  `,
  styles: [
  ]
})
export class CategoryComponent implements OnInit {
  categories$!:Observable<Category[]>;

  constructor(private categoryService:CategoryService){
  }

  ngOnInit(): void {
    this.categories$=this.categoryService
                     .getCategories()
                     .pipe(map(resp=>resp.categories));
  }



}
