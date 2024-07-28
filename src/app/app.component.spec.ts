import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { UserInputComponent } from './components/user-input/user-input.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { WorkoutProgressComponent } from './components/workout-progress/workout-progress.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing'; // Use this import

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterOutlet,
        UserInputComponent,
        UserListComponent,
        WorkoutProgressComponent,
        CommonModule,
        FormsModule,
        SidebarComponent,
        RouterTestingModule,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'health-challenge-tracker'`, () => {
    expect(component.title).toEqual('health-challenge-tracker');
  });

  it('should render title in an h1 tag', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('health-challenge-tracker');
  });
});
