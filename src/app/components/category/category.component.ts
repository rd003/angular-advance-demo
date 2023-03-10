import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/models/category.model';

@Component({
  selector: 'app-category',
  template: `
    <h3>Categories</h3>
{{categories$|async|json}}
    <ng-container *ngIf="categories$|async as categories">
     <div>
       <ul>
        <li *ngFor="let category of categories">
           {{category.id}} | 
           {{category.name}}
        </li>
       </ul>
     </div>
    </ng-container>
  `,
  styles: [
  ]
})
export class CategoryComponent implements OnInit {
  categories$!:Observable<Category[]>;
  constructor(private categoryService:CategoryService){
  }
  ngOnInit(): void {
    this.categories$=this.categoryService.getCategories();
  }
}
