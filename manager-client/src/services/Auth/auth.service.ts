import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private apiUrl = 'https://localhost:7260/api/auth';  // ה-API של השרת
 
   constructor(private http: HttpClient) {}

   //call to the server to get the token
    login(email: string, password: string) : Observable<any> {
      const res = this.http.post(`${this.apiUrl}/login`, { email, password });
//save the token in session storage
      res.subscribe((response: any) => {
        const token = response.token;
        sessionStorage.setItem('token', token);
        this.setLoggedIn(true); // עדכון הסטטוס של ההתחברות
      });
      return res;
    }
    private _isLoggedIn = new BehaviorSubject<boolean>(sessionStorage.getItem('token') !== null);
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  setLoggedIn(status: boolean) {
    this._isLoggedIn.next(status);
  }
}
