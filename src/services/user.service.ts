import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../app/models/user.model';
import { IUser } from '../app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private jsonApiUrl = 'https://jsonplaceholder.typicode.com/users';
  private apiUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.jsonApiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.jsonApiUrl}/${id}`);
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/allUsers`);
  }

  getUserDetailsById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/addUser`, user);
  }

  updateUser(id: number, userDetails: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/user/${id}`, userDetails);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${id}`);
  }
}

