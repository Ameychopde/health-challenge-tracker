import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { User } from '../../services/user.service'; // Adjust the path as necessary

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule, NgxPaginationModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  searchName = '';
  filterType = '';
  page = 1;
  pageSize = 5;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users = this.userService.getUsers();
    this.filteredUsers = this.users;
    this.paginateUsers();
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.filterType ? user.workouts.some(w => w.type === this.filterType) : true)
    );
    this.page = 1; // Reset page number when filters are applied
    this.paginateUsers();
  }

  paginateUsers() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  pageChange(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.page = page;
      this.paginateUsers();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  getWorkoutTypes(user: User): string {
    return user.workouts.map(w => w.type).join(', ');
  }

  getTotalMinutes(user: User): number {
    return user.workouts.reduce((sum, workout) => sum + workout.minutes, 0);
  }
}
