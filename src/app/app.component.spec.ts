import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  // it('should create the app', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app).toBeTruthy();
  // });

  it('should create the app',()=>{
    const fixture=TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  })
  it('should set the title property', () => {
    const app = new AppComponent();
    expect(app.title).toEqual('hi');
  });
  
  it('should render the title in a div with the class "title"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.title');
    expect(title).toBeDefined();
    expect(title.textContent.trim()).toEqual('hi');
  });
  
  it('should include a router-outlet element', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeDefined();
  });
  
  
  
  
  
  
});
