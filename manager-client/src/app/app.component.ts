import {  Component } from '@angular/core';
import { LoginComponent } from "../components/Login/login/login.component";
import { AuthService } from '../services/Auth/auth.service';
import { NavBarComponent } from "../components/NavBar/nav-bar/nav-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'manager-client';
  insite = false;

  constructor(private authState: AuthService) {
    this.authState.isLoggedIn$.subscribe(status => {
      this.insite = status;
    });
  }

  // נשלח לפעולה של login
  
}
