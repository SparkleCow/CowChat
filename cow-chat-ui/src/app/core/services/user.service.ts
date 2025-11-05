import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserResponseDto } from '../../models/user-response-dto';
import { AuthResponseDto } from '../../models/auth-response-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private url: string = "http://localhost:8080";
  private url: string = "http://192.168.1.2:8080";

  /*Observable for logged user*/
  private userSubject = new BehaviorSubject<UserResponseDto | null>(null);
  public user$: Observable<UserResponseDto | null> = this.userSubject.asObservable();

  /*Observable for contacts.*/
  private usersSubject = new BehaviorSubject<UserResponseDto[]>([]);
  public users$: Observable<UserResponseDto[]> = this.usersSubject.asObservable();

  /* Observable for receiver ID */
  private receiverIdSubject = new BehaviorSubject<string | null>(localStorage.getItem('receiverId'));
  public receiverId$: Observable<string | null> = this.receiverIdSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * It loads all users if they are not already loaded
   * If they are loaded, it will not the request again
   */
  loadAllUsers(forceReload: boolean = false): void {
    if (this.usersSubject.value.length > 0 && !forceReload) {
      return;
    }

    this.http.get<UserResponseDto[]>(`${this.url}/user`)
      .pipe(
        tap(users => this.usersSubject.next(users))
      )
      .subscribe({
        error: (err) => console.error('Error al cargar usuarios:', err)
      });
  }

  updateUserPresence(userId: string, online: boolean): void {
    const currentUsers = this.usersSubject.value;
    const updatedUsers = currentUsers.map(user =>
      user.id === userId ? { ...user, isOnline: online } : user
    );

    this.usersSubject.next(updatedUsers);
  }

  /**
   * Returns users observable
  */
  getAllUsers(): Observable<UserResponseDto[]> {
    return this.users$;
  }

  getUserByIdFromCache(userId: string): UserResponseDto | null {
    const users = this.usersSubject.value;
    return users.find(u => u.id === userId) || null;
  }

  findUserLogged(): void {
    this.http.get<UserResponseDto>(`${this.url}/user/self`).subscribe({
      next: (user) => {this.userSubject.next(user)
      },
      error: (err) => {
        console.error('Error al obtener usuario logueado:', err);
        this.userSubject.next(null);
      }
    });
  }

  uploadUserImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('key', file.name);
    formData.append('file', file);
    return this.http.post(`${this.url}/user/upload`, formData, { responseType: 'text' });
  }

  updateUsername(newUsername: string): Observable<AuthResponseDto> {
    return this.http.put<AuthResponseDto>(`${this.url}/user/update`, { username: newUsername });
  }

  /**
   * Save the receiverId en in reactive memory and localStorage
   */
  saveReceiverId(receiverId: string): void {
    localStorage.setItem('receiverId', receiverId);
    this.receiverIdSubject.next(receiverId);
  }

  /**
   * Returns the receiverId observable
   */
  getReceiverId(): Observable<string | null> {
    return this.receiverId$;
  }

  clearUser(): void {
    this.userSubject.next(null);
    this.usersSubject.next([]);
  }
}
