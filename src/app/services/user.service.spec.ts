import { TestBed } from '@angular/core/testing';
import { UserService, User, Workout } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
    // Reset the users array before each test to avoid state leakage
    (service as any).users = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [
          { type: 'Running', minutes: 30 },
          { type: 'Cycling', minutes: 45 }
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        workouts: [
          { type: 'Swimming', minutes: 60 },
          { type: 'Running', minutes: 20 }
        ]
      },
      {
        id: 3,
        name: 'Mike Johnson',
        workouts: [
          { type: 'Yoga', minutes: 50 },
          { type: 'Cycling', minutes: 40 }
        ]
      }
    ];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all users', () => {
    const users = service.getUsers();
    expect(users.length).toBe(3);
    expect(users).toEqual([
      {
        id: 1,
        name: 'John Doe',
        workouts: [
          { type: 'Running', minutes: 30 },
          { type: 'Cycling', minutes: 45 }
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        workouts: [
          { type: 'Swimming', minutes: 60 },
          { type: 'Running', minutes: 20 }
        ]
      },
      {
        id: 3,
        name: 'Mike Johnson',
        workouts: [
          { type: 'Yoga', minutes: 50 },
          { type: 'Cycling', minutes: 40 }
        ]
      }
    ]);
  });

  it('should add a new user', () => {
    const newUser: User = { id: 4, name: 'Alice Brown', workouts: [{ type: 'Running', minutes: 30 }] };
    service.addUser(newUser);
    const users = service.getUsers();
    expect(users.length).toBe(4);
    expect(users[3]).toEqual(newUser);
  });

  it('should return user by name', () => {
    const user = service.getUserByName('Jane Smith');
    expect(user).toEqual({
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Running', minutes: 20 }
      ]
    });
  });

  it('should return undefined if user by name does not exist', () => {
    const user = service.getUserByName('Nonexistent User');
    expect(user).toBeUndefined();
  });

  it('should return workout data for a specific user', () => {
    const workoutData = service.getWorkoutDataForUser('John Doe');
    expect(workoutData).toEqual({
      labels: ['Running', 'Cycling'],
      data: [30, 45]
    });
  });

  it('should return empty workout data for a nonexistent user', () => {
    const workoutData = service.getWorkoutDataForUser('Nonexistent User');
    expect(workoutData).toEqual({
      labels: [],
      data: []
    });
  });

  it('should return aggregated workout data for all users', () => {
    const workoutData = service.getAllWorkoutData();
    expect(workoutData).toEqual({
      labels: ['Running', 'Cycling', 'Swimming', 'Yoga'],
      data: [50, 85, 60, 50]
    });
  });

  it('should handle adding a user with no workouts', () => {
    const newUser: User = { id: 4, name: 'Bob Green', workouts: [] };
    service.addUser(newUser);
    const users = service.getUsers();
    expect(users.length).toBe(4);
    expect(users[3]).toEqual(newUser);
  });

  it('should handle adding a user with workouts having zero minutes', () => {
    const newUser: User = { id: 4, name: 'Sam Blue', workouts: [{ type: 'Running', minutes: 0 }] };
    service.addUser(newUser);
    const workoutData = service.getWorkoutDataForUser('Sam Blue');
    expect(workoutData).toEqual({
      labels: ['Running'],
      data: [0]
    });
  });

  it('should correctly aggregate workout data for all users after adding a new user', () => {
    const newUser: User = { id: 4, name: 'Alice Brown', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 10 }] };
    service.addUser(newUser);
    const workoutData = service.getAllWorkoutData();
    expect(workoutData).toEqual({
      labels: ['Running', 'Cycling', 'Swimming', 'Yoga'],
      data: [80, 95, 60, 50]
    });
  });
});
