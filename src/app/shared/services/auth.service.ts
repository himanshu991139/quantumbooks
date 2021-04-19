import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { LoginResponse, RegisterResponse } from 'src/app/model/auth.model';
import { Login } from 'src/app/model/login.model';
import { Register } from 'src/app/model/register.model';
import { User } from 'src/app/model/user.model';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) {}
  signUp(data: Register): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
        {
          email: data.email,
          password: data.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((res) => {
          this.authenticatedUser(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }
  signIn(data: Login): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        {
          email: data.email,
          password: data.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((res) => {
          this.authenticatedUser(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }
  googleSignIn(idToken:string) {
    return this.http.post<any>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${environment.apiKey}`,
      {
        postBody: `id_token=${idToken}&providerId=google.com`,
        requestUri: `http://localhost:4200`,
        returnIdpCredential: true,
        returnSecureToken: true,
      }
    ).pipe(
      tap((res) => {
        this.authenticatedUser(
          res.email,
          res.localId,
          res.idToken,
          +res.expiresIn
        );
      })
    );
  }
  forgotPassword(data) {
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${environment.apiKey}`,
      {
        email: data.email,
        requestType: 'PASSWORD_RESET',
      }
    );
  }
  autoSignIn() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    } else {
      const loggedInUser = new User(
        userData.email,
        userData.id,
        userData.token,
        new Date(userData.expirationDate)
      );
      if (loggedInUser.getToken()) {
        this.user.next(loggedInUser);
        // const expirationDuration=new Date(userData.expirationDate).getTime()-new Date().getTime()
        // this.autoSignOut(expirationDuration)
      }
    }
  }

  signOut() {
    this.user.next(null);
    this.router.navigate(['']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
  autoSignOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.signOut();
    }, expirationDuration);
  }
  authenticatedUser(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
    this.autoSignOut(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
