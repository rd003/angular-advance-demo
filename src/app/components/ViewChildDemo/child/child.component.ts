import { Component } from '@angular/core';

@Component({
  selector: 'app-child',
  styles: [
  ],
  template: `
   <p>Child Counter: {{ counter }}</p>
  `

})
export class ChildComponent {
  counter = 0;
  incrementCounter() {
    this.counter++;
  }

}
