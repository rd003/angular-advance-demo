import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { CounterComponent } from './components/counter/counter.component';
import { HomeComponent } from './components/home/home.component';
import { ParentComponent } from './components/ViewChildDemo/parent/parent.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'counter',component:CounterComponent},
  {path:'categories',component:CategoryComponent},
  {path:'viewchild',component:ParentComponent},
  {path:'',redirectTo:'/home',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
