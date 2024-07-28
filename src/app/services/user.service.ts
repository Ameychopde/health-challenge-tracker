import { Injectable } from '@angular/core';

export interface Workout {
  type: string;
  minutes: number;
}

export interface User {
  id: number;
  name: string;
  workouts: Workout[];
}


const userData: User[] = [
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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = userData;

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    user.id = this.users.length + 1; // Assign a new ID
    this.users.push(user);
  }

  getUserByName(name: string): User | undefined {
    return this.users.find(user => user.name === name);
  }

  getWorkoutDataForUser(userName: string): { labels: string[], data: number[] } {
    const user = this.getUserByName(userName);
    if (!user) {
      return { labels: [], data: [] };
    }

    const workoutData = user.workouts;
    const workoutCounts = workoutData.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + workout.minutes;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(workoutCounts),
      data: Object.values(workoutCounts)
    };
  }

  getAllWorkoutData(): { labels: string[], data: number[] } {
    const workoutData = this.users.flatMap(user => user.workouts);
    const workoutCounts = workoutData.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + workout.minutes;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(workoutCounts),
      data: Object.values(workoutCounts)
    };
  }
}
