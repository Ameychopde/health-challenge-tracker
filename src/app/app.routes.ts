import { Routes } from '@angular/router';
import { UserInputComponent } from './components/user-input/user-input.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { WorkoutProgressComponent } from './components/workout-progress/workout-progress.component';

export const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'input', component: UserInputComponent },
  { path: 'progress', component: WorkoutProgressComponent },
  { path: '**', redirectTo: '' } // Redirect to home if the path is not found
];
