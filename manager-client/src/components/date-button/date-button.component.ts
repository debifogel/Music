import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/Users/users.service';
import { DatePickerDialogComponent } from '../date-picker-dialog/date-picker-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-date-button',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule,MatDatepickerModule,
    MatNativeDateModule,    MatIconModule
  ],
  templateUrl: "./date-button.component.html",
  styleUrls: ["./date-button.component.css"]  
})
export class DateButtonComponent {
  constructor(public dialog: MatDialog, private userService: UserService) {}
  @Input() expandText: string = 'חסימת משתמשים';
  
  isHovered: boolean = false;
  openDatePicker(): void {
    const dialogRef = this.dialog.open(DatePickerDialogComponent, {
      width: '350px',
      direction: 'rtl'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.blockGroupByDate(result).subscribe(() => {
          console.log("הקבוצה נחסמה בהצלחה");
        }, error => {
          console.error("שגיאה בחסימת הקבוצה", error);
        });
        console.log(`תאריך שנבחר: ${result}`);
      }
    });
  }
//TODO:not called ?
blockGroupByDate(date: Date): Observable<void> {
  return new Observable<void>((observer) => {
    console.log("to api server");
    console.log("date", date);
    this.userService.blockGroupByDate(date).subscribe(
      () => {
        console.log(`הקבוצה נחסמה בהצלחה בתאריך: ${date}`);
        observer.next();
        observer.complete();
      },
      (error) => {
        console.error(`שגיאה בחסימת הקבוצה בתאריך ${date}:`, error);
        observer.error(error);
      }
    );
  });
}
}