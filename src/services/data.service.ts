import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private formDataKey = 'formData';
  private baseUrl = 'http://localhost:2005'; // Update with your backend API URL

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  generatePdf(htmlContent: any) {
    return this.http.post(`${this.baseUrl}/api/cv-generator/html-to-pdf`, { html: htmlContent }, { responseType: 'blob' });
  }

  private formDataSubject = new BehaviorSubject<any>({});


  updateFormData(formData: any): void {
    this.formDataSubject.next(formData);
    // localStorage.setItem(this.formDataKey, JSON.stringify(formData));
  }

  getFormData(): Observable<any> {
    // const formDataString = localStorage.getItem(this.formDataKey);
    // return formDataString ? JSON.parse(formDataString) : {};
    return this.formDataSubject.asObservable();
  }
  
}
