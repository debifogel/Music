import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/Users/users.service';
import { User } from '../../../models/User';
import { ConfirmDialogComponent } from '../../Dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-actions',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './list-users-action.component.html',
  styleUrls: ['./list-users-action.component.css']
})
export class UserActionsComponent {
  @Input() user: User | undefined;

  constructor(
    private UserService: UserService,
    private dialog: MatDialog
  ) {}

  // חסימת משתמש עם אישור
  blockUser(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.user) {
          this.UserService.blockUser(this.user.email).subscribe(() => {
            this.user!.blocked = true;
            alert('המשתמש חסום');
          });
        }
      }
    });
  }

  // ביטול חסימה עם אישור
  unblockUser(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.user) {
          this.UserService.unblockUser(this.user.email).subscribe(() => {
            this.user!.blocked = false;
            alert('המשתמש שוחרר מחסימה');
          });
        }
      }
    });
  }

  // מחיקת משתמש עם אישור
  deleteUser(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.user) {
          this.UserService.deleteUser(this.user.email).subscribe(() => {
            alert('המשתמש נמחק');
          });
        }
      }
    });
  }
}
