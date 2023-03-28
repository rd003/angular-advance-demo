import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalCounterService } from 'src/app/services/global-counter.service';

@Component({
  selector: 'app-counter',
  template: `
    <p>
     count: {{counter$|async}}
    </p>
    <button class="button mx-2" (click)="increment()">+</button>
    <button class="button mx-2" (click)="decrement()">-</button>

  `,
  styles: [
  ]
})
export class CounterComponent implements OnInit {
  counter$!: Observable<number>;
  increment() {
    this.counterService.increment();
  }

  decrement() {
    this.counterService.decrement();
  }
  ngOnInit(): void {
    this.counter$ = this.counterService.counter$;
  }
  
  constructor(private counterService: GlobalCounterService) {
    
  }
}
