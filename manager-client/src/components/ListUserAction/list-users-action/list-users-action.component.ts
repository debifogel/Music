import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  // חסימת משתמש עם אישור
  blockUser(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
      message: 'האם אתה בטוח שברצונך לחסום את המשתמש?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.user) {
          this.UserService.blockUser(this.user.userId).subscribe(() => {
            this.user!.isBlocked = true;
            this.snackBar.open('המשתמש נחסם', 'סגור', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          });
        }
      }
    });
  }

  // ביטול חסימה עם אישור
  unblockUser(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
      message: 'האם אתה בטוח שברצונך לשחרר את המשתמש מחסימה?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.user) {
          this.UserService.unblockUser(this.user.userId).subscribe(() => {
            this.user!.isBlocked = false;
            // Inside the constructor, add MatSnackBar:

            // Replace the $SELECTION_PLACEHOLDER$ code with:
            this.snackBar.open('המשתמש שוחרר מחסימה', 'סגור', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          });
        }
      }
    });
  }

  // מחיקת משתמש עם אישור
  deleteUser(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
      message: 'האם אתה בטוח שברצונך למחוק את המשתמש?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.user) {
          this.UserService.deleteUser(this.user.userId).subscribe(() => {
            this.snackBar.open('המשתמש נמחק', 'סגור', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            
          });
        }
      }
    });
  }
}
