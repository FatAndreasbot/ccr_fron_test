import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IUser } from '../../interfaces/iuser';
import { IAuthResponse } from '../../interfaces/iauth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private endpointURL = "http://localhost:8000/api/news"
  private tokenSubject = new BehaviorSubject<string|null>(null)
  token$ = this.tokenSubject.asObservable()

  constructor (
    private http: HttpClient
  ) {
    const token = localStorage.getItem("token")
    this.tokenSubject.next(token)
  }

  isLoggedIn():boolean{
    return this.tokenSubject.value != null
  }

  logIn(userdata:IUser):Observable<IAuthResponse>{
    return this.http.post<IAuthResponse>(
      this.endpointURL,
      userdata,
      {
        withCredentials:true,
        headers:{
          "Content-Type": "application/json"
      }}
    ).pipe(
      tap(resp => {
        localStorage.setItem("token", resp.key)
        this.tokenSubject.next(resp.key)
      })
    )
  }

  logOut(){
    this.tokenSubject.next(null);
    localStorage.removeItem("token")
  }
  
  getToken(){
    if (this.isLoggedIn())
      return this.tokenSubject.value
    throw new Error("user is not logged in")
  }


  
}
