import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7260/example.com/api/users';  // ה-API של השרת

  constructor(private http: HttpClient) {}

  // מביא את כל המשתמשים
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // חסימת משתמש
  blockUser(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/block`, { email });
  }

  // ביטול חסימה של משתמש
  unblockUser(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/block`, { email });
  }

  // מחיקת משתמש לצמיתות
  deleteUser(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${email}`);
  }
  getAllUserDates() {
    return this.http.get<string[]>(this.apiUrl); // DateOnly מגיע כ־string
  }
}
