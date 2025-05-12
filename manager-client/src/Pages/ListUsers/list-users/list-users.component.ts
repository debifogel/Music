import { Component, OnInit } from '@angular/core';
import {  MatDialogModule } from '@angular/material/dialog';
import { User } from '../../../models/User';
import { UserService } from '../../../services/Users/users.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserActionsComponent } from "../../../components/ListUserAction/list-users-action/list-users-action.component";
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateButtonComponent } from "../../../components/date-button/date-button.component";


@Component({
  selector: 'app-list-users',
  standalone: true,
    imports: [MatDialogModule, FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    UserActionsComponent,
    MatTableModule,
    MatIconModule,
    DatePipe, DateButtonComponent],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchEmail: string = '';
  showBlocked: boolean = true;  // האם להציג את המשתמשים החסומים
  currentDate = new Date();
  searchQuery: string = ''; // אחסון מילת החיפוש

  displayedColumns: string[] = ['name','email', 'lastLogin', 'lastUsage', 'actions'];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  clearSearch(): void {
    this.searchQuery = '';// מנקה את שדה החיפוש
    this.filteredUsers = this.users; // מחזיר את כל המשתמשים
  }
  // פונקציה שמביאה את כל המשתמשים
  getUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
      console.log(users);
    });
  }

  // פונקציה להציג או להסתיר חסומים
  toggleBlockedUsers(): void {
    if (this.showBlocked) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => !user.isBlocked);
    }
  }
  
  Search(): void {
    this.filteredUsers = this.users.filter(user => 
       user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log(this.filteredUsers);
    console.log(this.searchQuery);
  }
}
