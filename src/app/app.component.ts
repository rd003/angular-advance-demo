import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      {{title}}
    </div>
    <app-category></app-category>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'hi';
}
