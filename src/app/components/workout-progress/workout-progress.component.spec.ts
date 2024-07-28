import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutProgressComponent } from './workout-progress.component';
import { UserService } from '../../services/user.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

class MockUserService {
  
  private users = [
    { name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
    { name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }] },
  ];

  getUsers() {
    return this.users;
  }

  getUserByName(name: string) {
    return this.users.find(user => user.name === name);
  }

  getAllWorkoutData() {
    const allWorkouts = this.users.flatMap(user => user.workouts);
    const workoutCounts = allWorkouts.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + workout.minutes;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(workoutCounts),
      data: Object.values(workoutCounts)
    };
  }
}

describe('WorkoutProgressComponent', () => {
  let component: WorkoutProgressComponent;
  let fixture: ComponentFixture<WorkoutProgressComponent>;
  let userService: MockUserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutProgressComponent, CommonModule, FormsModule],
      providers: [{ provide: UserService, useClass: MockUserService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutProgressComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as unknown as MockUserService;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize users and create chart on ngOnInit', () => {
    component.ngOnInit();

    // Check if users are initialized
    expect(component.users).toEqual(userService.getUsers().map(user => user.name));

    // Check if the chart is created
    expect(component.chart).toBeDefined();
    if (component.chart) {
      // Assert the chart data
      const chartData = component.chart.data as {
        labels: string[];
        datasets: { data: number[] }[];
      };

      expect(chartData.labels).toEqual(userService.getAllWorkoutData().labels);
      expect(chartData.datasets[0].data).toEqual(userService.getAllWorkoutData().data);
    } else {
      fail('Chart should be defined');
    }
  });

  it('should update chart when a user is selected', () => {
    component.ngOnInit();
    component.onUserChange('John Doe');

    // Check if chart data is updated for selected user
    const user = userService.getUserByName('John Doe');
    if (user) {
      const workoutData = user.workouts;
      const workoutCounts = workoutData.reduce((acc, workout) => {
        acc[workout.type] = (acc[workout.type] || 0) + workout.minutes;
        return acc;
      }, {} as Record<string, number>);

      const labels = Object.keys(workoutCounts);
      const data = Object.values(workoutCounts);

      if (component.chart) {
        const chartData = component.chart.data as {
          labels: string[];
          datasets: { data: number[] }[];
        };

        expect(chartData.labels).toEqual(labels);
        expect(chartData.datasets[0].data).toEqual(data);
      } else {
        fail('Chart should be defined');
      }
    }
  });

  it('should update chart with all workout data if no user is selected', () => {
    component.ngOnInit();

    // Update chart with all workout data
    component.onUserChange('');
    const allWorkoutData = userService.getAllWorkoutData();

    if (component.chart) {
      const chartData = component.chart.data as {
        labels: string[];
        datasets: { data: number[] }[];
      };

      expect(chartData.labels).toEqual(allWorkoutData.labels);
      expect(chartData.datasets[0].data).toEqual(allWorkoutData.data);
    } else {
      fail('Chart should be defined');
    }
  });

  it('should create chart correctly if it does not exist', () => {
    component.ngOnInit();
    component.chart = undefined;

    // Mock Chart creation method
    spyOn(Chart.prototype, 'update').and.callThrough();
    component.createChart(['Running', 'Cycling'], [75, 45]);

    if (component.chart) {
      const chartData = component.chart as {
        labels: string[];
        datasets: { data: number[] }[];
      };

      expect(chartData.labels).toEqual(['Running', 'Cycling']);
      expect(chartData.datasets[0].data).toEqual([75, 45]);
    } else {
      fail('Chart should be defined');
    }
  });
});
