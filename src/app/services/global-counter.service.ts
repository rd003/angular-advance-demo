import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalCounterService {
  private counterState$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  
  counter$ = this.counterState$.asObservable();

  increment=()=>
    this.counterState$.next(this.counterState$.value + 1);
  
  decrement = () =>
     this.counterState$.next(this.counterState$.value - 1);

  constructor() {
    this.counterState$.next(0);
   }
}
