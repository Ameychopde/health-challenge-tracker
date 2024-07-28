import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { User } from '../../services/user.service';

// Mock UserService
class MockUserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
    { id: 2, name: 'Jane Smith', workouts: [{ type: 'Cycling', minutes: 45 }] },
    { id: 3, name: 'Alice Johnson', workouts: [{ type: 'Swimming', minutes: 60 }] },
    { id: 4, name: 'Bob Brown', workouts: [{ type: 'Running', minutes: 20 }] },
    { id: 5, name: 'Emily Davis', workouts: [{ type: 'Cycling', minutes: 50 }] },
    { id: 6, name: 'Frank White', workouts: [{ type: 'Swimming', minutes: 40 }] },
    // Add more mock users as needed
  ];

  getUsers(): User[] {
    return this.users;
  }
}

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: MockUserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent, NgxPaginationModule],
      providers: [{ provide: UserService, useClass: MockUserService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as unknown as MockUserService;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize users and paginate on ngOnInit', () => {
    component.ngOnInit();
    expect(component.users).toEqual(userService.getUsers());
    expect(component.filteredUsers).toEqual(component.users);
    expect(component.paginatedUsers.length).toBe(component.pageSize); // Ensure page size matches
  });

  it('should filter users based on searchName and filterType', () => {
    component.searchName = 'John';
    component.filterType = 'Running';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
    expect(component.filteredUsers[0].workouts[0].type).toBe('Running');
  });

  it('should paginate users correctly', () => {
    component.page = 1;
    component.pageSize = 2; // Change page size for testing
    component.paginateUsers();
    expect(component.paginatedUsers.length).toBe(2);
    expect(component.paginatedUsers[0].name).toBe('John Doe');
    expect(component.paginatedUsers[1].name).toBe('Jane Smith');
  });

  it('should handle page changes correctly', () => {
    component.page = 1;
    component.pageSize = 2;
    component.paginateUsers();
    expect(component.paginatedUsers[0].name).toBe('John Doe');
    expect(component.paginatedUsers[1].name).toBe('Jane Smith');

    component.pageChange(2);
    expect(component.page).toBe(2);
    expect(component.paginatedUsers[0].name).toBe('Alice Johnson');
  });

  it('should calculate total pages correctly', () => {
    component.pageSize = 2;
    component.filteredUsers = userService.getUsers(); // Mock filtered users
    expect(component.getTotalPages()).toBe(3); // Adjust expected value based on the mock data
  });
});
