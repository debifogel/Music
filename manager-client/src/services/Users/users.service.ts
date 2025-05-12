import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7260/api/users';  // תקן את זה, אין צורך ב־example.com

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); // או כל שם ששמרת בו את הטוקן
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  blockUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/block/${ id }`,{} ,{ headers: this.getAuthHeaders() });
  }

  unblockUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/block/${id}`,{}, { headers: this.getAuthHeaders() });
  }
  blockGroupByDate(date: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(
      `${this.apiUrl}/blockgroup/${date}`,
      {},
      { headers }
    );
  }
   
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getAllUserDates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/dates`, { headers: this.getAuthHeaders() });
  }
}
