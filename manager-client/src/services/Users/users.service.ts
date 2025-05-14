import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://musicserver-xzkr.onrender.com/api/users';

  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable(); // נהפוך את הרשימה ל־Observable

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadUsers(): void {
    // כל פעם שהמשתמשים נטענים, נעדכן את ה־Subject
    this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .subscribe(users => this.usersSubject.next(users));
  }

  getUsers(): Observable<User[]> {
    return this.users$; // מחזיר את ה־Observable לעבודה עם הקומפוננטות
  }

  blockUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/block/${id}`, {}, { headers: this.getAuthHeaders() })
      .pipe(tap(() => this.loadUsers())); // טוען מחדש את המשתמשים אחרי כל פעולה
  }

  unblockUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/block/${id}`, {}, { headers: this.getAuthHeaders() })
      .pipe(tap(() => this.loadUsers()));
  }

  blockGroupByDate(date: Date): Observable<void> {
    const formattedDate = date.toISOString(); 
    return this.http.put<void>(
      `${this.apiUrl}/blockgroup/${formattedDate}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(tap(() => this.loadUsers()));
  }
  getAllUserDates(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/dates`,
      { headers: this.getAuthHeaders() }
    );
  }
}
