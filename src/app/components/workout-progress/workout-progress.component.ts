import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workout-progress',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-progress.component.html',
  styleUrls: ['./workout-progress.component.css']
})
export class WorkoutProgressComponent implements OnInit {
  chart: Chart | undefined;
  users: string[] = [];
  selectedUser: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    Chart.register(...registerables);

    // Get users for dropdown
    this.users = this.userService.getUsers().map(user => user.name);

    // Create chart with default data
    this.updateChart();
  }

  onUserChange(userName: string) {
    this.selectedUser = userName;
    this.updateChart();
  }

  updateChart() {
    let labels: string[] = [];
    let data: number[] = [];

    if (this.selectedUser) {
      const user = this.userService.getUserByName(this.selectedUser);
      if (user) {
        const workoutData = user.workouts;
        const workoutCounts = workoutData.reduce((acc, workout) => {
          acc[workout.type] = (acc[workout.type] || 0) + workout.minutes;
          return acc;
        }, {} as Record<string, number>);

        labels = Object.keys(workoutCounts);
        data = Object.values(workoutCounts);
      }
    } else {
      const allWorkoutData = this.userService.getAllWorkoutData();
      labels = allWorkoutData.labels;
      data = allWorkoutData.data;
    }

    this.createChart(labels, data);
  }

  createChart(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    } else {
      this.chart = new Chart('workoutChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Workout Minutes',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true }
          }
        }
      });
    }
  }
}
