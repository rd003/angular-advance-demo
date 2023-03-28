import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalCounterService } from 'src/app/services/global-counter.service';

@Component({
  selector: 'app-home',
  template: `
    <p>
      home works!
    </p>

    <p>
      counts : {{counter$|async}}
    </p>
  `,
  styles: [
  ]
})
export class HomeComponent implements OnInit{
  counter$!: Observable<number>;

  ngOnInit(): void {
    this.counter$ = this.counterService.counter$;
  }
  
  constructor(private counterService: GlobalCounterService) {
    
  }
}
