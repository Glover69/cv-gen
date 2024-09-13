import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Resume } from '../models/data.models';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private formDataKey = 'formData';
  private baseUrl = environment.baseUrl
  constructor(private http: HttpClient, private fb: FormBuilder) { }

  
  generatePdf(htmlContent: any) {
    return this.http.post(`${this.baseUrl}/api/cv-generator/html-to-pdf`, { html: htmlContent }, { responseType: 'blob' });
  }

  public formDataSubject = new BehaviorSubject<any>({});


  updateFormData(formData: any): void {
    this.formDataSubject.next(formData);
    // localStorage.setItem(this.formDataKey, JSON.stringify(formData));
  }

  getFormData(): Observable<any> {
    // const formDataString = localStorage.getItem(this.formDataKey);
    // return formDataString ? JSON.parse(formDataString) : {};
    return this.formDataSubject.asObservable();
  }
  

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/add-user`, {user})
  }

  getUserByAuthID(authID: string | undefined): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/auth/get-user/${authID}`);
  }

  saveToCollection(collectionID: string, file: Resume): Observable<any>{
    const cleanData = JSON.parse(JSON.stringify(file));
    return this.http.post(`${this.baseUrl}/api/collections/${collectionID}/add`, cleanData)
  }
}
