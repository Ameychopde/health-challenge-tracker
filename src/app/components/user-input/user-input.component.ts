import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserInputComponent {
  userName = '';
  workoutType = '';
  workoutMinutes = 0;

  constructor(private userService: UserService) {}

  addUser() {
    this.userService.addUser({
      id: this.userService.getUsers().length + 1, // Ensure unique ID
      name: this.userName,
      workouts: [{ type: this.workoutType, minutes: this.workoutMinutes }]
    });
    this.userName = '';
    this.workoutType = '';
    this.workoutMinutes = 0;
  }
}
