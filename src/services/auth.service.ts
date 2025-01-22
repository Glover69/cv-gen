import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  UserResponse,
  UserSignIn,
  UserVerification,
} from '../models/data.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserResponse>(
      JSON.parse(localStorage.getItem('currentUSER') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserResponse {
    return this.currentUserSubject.value;
  }

  //   signup(email: string, password: string, firstName: string, lastName: string): Observable<HttpResponse<UserVerification>> {
  //     return this.http.post<UserVerification>(`${this.apiUrl}/api/auth/signup`, { firstName, lastName, email, password }, { observe: 'response' })
  //     .pipe(map(user => {
  //         // store user details and jwt token in local storage to keep user logged in between page refreshes
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //         localStorage.setItem('customerID', JSON.stringify(user.body?.user.customerID));
  //         this.currentUserSubject.next(user);
  //         return user;
  //       }));
  //   }
  signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
  ): Observable<HttpResponse<UserVerification>> {
    return this.http.post<UserVerification>(
      `${this.apiUrl}/api/auth/signup`,
      { firstName, lastName, email, password, phoneNumber },
      { observe: 'response' }
    );
  }

  // Verify OTP
  verifyOTP(
    customerID: string,
    otp: string,
    email: string,
  ): Observable<HttpResponse<UserResponse>> {
    return this.http.post<UserResponse>(
      `${this.apiUrl}/api/auth/verify-otp`,
      { customerID, otp, email },
      { observe: 'response' }
    );
  }

  signin(
    email: string,
    password: string
  ): Observable<HttpResponse<UserSignIn>> {
    return this.http
      .post<UserSignIn>(
        `${this.apiUrl}/api/auth/signin`,
        { email, password },
        { observe: 'response' }
      )
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUSER', JSON.stringify(user));
          localStorage.setItem(
            'customerID',
            JSON.stringify(user.body?.user.customerID)
          );
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUSER');
    this.currentUserSubject.next(null);
  }
}
