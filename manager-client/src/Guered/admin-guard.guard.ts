import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Import the jwt-decode library

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const token = sessionStorage.getItem('token'); // Assuming token is stored in session storage
    const userRole = this.getUserRoleFromToken(token); // Implement this method to decode the token and get the role
    console.log(userRole)
    if (userRole === 'Admin') {
      return true;
    } else {
      this.router.navigate(['/']); // Redirect to users if not admin
      return false;
    }
  }

  private getUserRoleFromToken(token: string | null): string {
    if (!token) {
      return 'user'; // Default role if no token is found
    }

    try {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken)
      return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];  // Extract the role
      ; // Return the role from the token or default to 'user'

    } catch (error) {
      console.error('Invalid token:', error);
      return 'user'; // Default role if token is invalid
    }
  }
}
