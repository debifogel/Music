import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../models/User';
import { UserService } from '../../../services/Users/users.service';
import { Subscription } from 'rxjs';

// Material Modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

// Components
import { UserActionsComponent } from '../../../components/ListUserAction/list-users-action/list-users-action.component';
import { DateButtonComponent } from '../../../components/date-button/date-button.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTableModule,
    MatIconModule,
    UserActionsComponent,
    DateButtonComponent,
    FormsModule,
    DatePipe    
  ],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  showBlocked: boolean = true;
  displayedColumns: string[] = ['name', 'email', 'lastLogin', 'lastUsage', 'actions'];

  private usersSubscription: Subscription = new Subscription();

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    // מאזין לשינויים ברשימה
    this.usersSubscription = this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.applyFilters();
    });

    // טוען את המשתמשים בהתחלה
    this.userService.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }
  toggleBlockedUsers(): void {
    this.applyFilters();
  }
  toggleSearch() {
      this.searchQuery = '';
    
    this.applyFilters();
  }
  Search(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch =
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesBlocked = this.showBlocked || !user.isBlocked;

      return matchesSearch && matchesBlocked;
    });
  }
}
