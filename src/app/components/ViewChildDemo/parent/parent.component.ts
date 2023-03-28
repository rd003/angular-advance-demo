import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
     
     <span #name> </span>
     <p>
     <button (click)="setName()">set name</button>
     </p>
  `,
  styles: [
  ]
})
export class ParentComponent {
  name = 'john'
  @ViewChild('name') nameSpan!: ElementRef;

  setName() {
    this.nameSpan.nativeElement.innerText = this.name;
  }
  
}
