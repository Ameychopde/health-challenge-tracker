// user-input.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInputComponent } from './user-input.component';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

// Define a User type
interface User {
  id: number;
  name: string;
  workouts: { type: string; minutes: number }[];
}

// Mock UserService
class MockUserService {
  private users: User[] = [];
  
  getUsers(): User[] {
    return this.users;
  }
  
  addUser(user: User): void {
    this.users.push(user);
  }
}

describe('UserInputComponent', () => {
  let component: UserInputComponent;
  let fixture: ComponentFixture<UserInputComponent>;
  let userService: MockUserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, UserInputComponent],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInputComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as unknown as MockUserService;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call addUser on UserService and reset form fields when addUser is called', () => {
    const initialUsersLength = userService.getUsers().length;

    component.userName = 'John Doe';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;
    
    component.addUser();
    
    // Check if UserService.addUser was called with the correct data
    expect(userService.getUsers().length).toBe(initialUsersLength + 1);
    expect(userService.getUsers()[0]).toEqual({
      id: initialUsersLength + 1,
      name: 'John Doe',
      workouts: [{ type: 'Running', minutes: 30 }]
    });
    
    // Check if form fields are reset
    expect(component.userName).toBe('');
    expect(component.workoutType).toBe('');
    expect(component.workoutMinutes).toBe(0);
  });
});
