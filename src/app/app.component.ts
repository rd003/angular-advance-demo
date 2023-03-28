import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!-- <div class="title">
      {{title}}
    </div> -->
    <!-- <app-category></app-category> -->
    <nav class="nav">
      <ul>
        <li><a routerLink="/home" routerLinkActive="active">home</a></li>
        <li><a routerLink="/counter" routerLinkActive="active">counter</a></li>
        <li><a routerLink="/categories" routerLinkActive="active">categories</a></li>
        <!-- <li><a routerLink="/viewchild" routerLinkActive="active">view-child-demo</a></li> -->
      </ul>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
   styles: [`
      .nav{
         background-color:gray;
      }   
      .nav ul{
        display:flex;
        align-items: center;
        margin: 0; 
        padding: 0; 
      }
      .nav ul li{
        list-style:none;
        padding:1rem 0.8rem;
      }

      .nav ul li a{
        color:white;
        text-decoration:none;
      }

      .nav ul li a:hover{
        color:red;
      }
      
      .active{
        color:red!important;
      }

      .container{
        padding:2rem 3rem;
      }
  `]
})
export class AppComponent {
  // title = 'hi';
}
