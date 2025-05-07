import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private apiUrl = 'https://localhost:7260/example.com/api/auth';  // ה-API של השרת
 
   constructor(private http: HttpClient) {}

   //call to the server to get the token
    login(email: string, password: string) {
      const res = this.http.post(`${this.apiUrl}/login`, { email, password });
//save the token in session storage
      res.subscribe((response: any) => {
        const token = response.token;
        sessionStorage.setItem('token', token);
      });
      return res;
    }
}
