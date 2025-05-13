import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-date-picker-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatNativeDateModule,
    
  ],
 templateUrl: './date-picker-dialog.component.html',
 styleUrls: ['./date-picker-dialog.component.css']
  
})
export class DatePickerDialogComponent {
  selectedDate: Date = new Date();

  constructor(
    public dialogRef: MatDialogRef<DatePickerDialogComponent>
  ) {}

  onConfirm(): void {
    // Format date as string (YYYY-MM-DD)
    const formattedDate = this.formatDate(this.selectedDate);
    this.dialogRef.close(formattedDate);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  private formatDate(date: Date): Date {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date? date : new Date();
  }
}