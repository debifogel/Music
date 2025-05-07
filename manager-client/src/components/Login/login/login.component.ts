import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/Auth/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatError,
    ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  // הוספת ה-AuthService לקונסטרקטור
  // כדי שנוכל להשתמש בו בהגשת הטופס
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  // משתנה שמבקר אם להציג את הטופס או לא
  showForm = false;

  // פונקציה שתשנה את מצב ה-showForm
  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSubmit() {
    if (this.email.valid && this.password.valid) {
      // כאן אפשר להוסיף את הלוגיקה לשליחת פרטי ההתחברות לשרת
     this.authService.login(this.email.value || '', this.password.value || '').subscribe(
        (response: any) => {    
 
        })
    } else {
      console.log('לא כל השדות תקינים');
    }
  }
}
