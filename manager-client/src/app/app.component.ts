import { Component } from '@angular/core';
import { LoginComponent } from "../components/Login/login/login.component";
import { ListUsersComponent } from "../Pages/ListUsers/list-users/list-users.component";
import { GrafimComponent } from "../Pages/Grafim/grafim/grafim.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, ListUsersComponent, GrafimComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
[x: string]: any;
  title = 'manager-client';

insite=sessionStorage.getItem('token') === null
  
}
