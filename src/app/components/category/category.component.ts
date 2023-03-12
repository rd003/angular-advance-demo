import { Component, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/models/category.model';

@Component({
  selector: 'app-category',
  template: `
    <h3>Categories</h3>
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
    this.categories$=this.categoryService.getCategories().pipe(map(resp=>resp.categories));
  }
  
}
