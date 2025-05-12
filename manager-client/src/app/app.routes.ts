import { Routes } from '@angular/router';
import { ListUsersComponent } from '../Pages/ListUsers/list-users/list-users.component';
import { GrafimComponent } from '../Pages/Grafim/grafim/grafim.component';
import { AdminGuard } from '../Guered/admin-guard.guard';
import { HomeComponent } from '../components/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent}, // Redirect root to users
    { path: 'users', component: ListUsersComponent ,canActivate: [AdminGuard]},
    { path: 'show-activity', component: GrafimComponent, canActivate: [AdminGuard] } // Guard for admin role
];
