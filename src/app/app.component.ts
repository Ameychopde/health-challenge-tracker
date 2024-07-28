import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInputComponent } from './components/user-input/user-input.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { WorkoutProgressComponent } from './components/workout-progress/workout-progress.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserInputComponent, UserListComponent, WorkoutProgressComponent ,CommonModule, FormsModule ,SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'health-challenge-tracker';
}
