import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

export function serializeForm(form: FormGroup): string {
  return JSON.stringify(form.value);
}

export function deserializeForm(serializedData: string): any {
  return JSON.parse(serializedData);
}


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'http://localhost:2005'; // Update with your backend API URL

  constructor(private http: HttpClient) { }

  generatePdf(htmlContent: any) {
    return this.http.post(`${this.baseUrl}/api/cv-generator/html-to-pdf`, { html: htmlContent }, { responseType: 'blob' });
  }

  saveFormData(form: FormGroup, key: string): void {
    const serializedData = serializeForm(form);
    localStorage.setItem(key, serializedData);
  }

  getFormData(key: string): FormGroup | null {
    const serializedData = localStorage.getItem(key);
    if (serializedData) {
      const formData = deserializeForm(serializedData); // Implement deserializeForm similarly to serializeForm
      console.log(serializedData); 
      return formData;
    }
    return null;
  }

  // getFormData(key: string): any {
  //   const formDataJson = localStorage.getItem(key);
  //   return formDataJson ? JSON.parse(formDataJson) : null;
  // }

  // getFormData(key: string): any {
  //   const formDataJson = localStorage.getItem(key);
  //   console.log(formDataJson); // Log the retrieved data to inspect it
  //   return formDataJson ? JSON.parse(formDataJson) : null;
  // }
  
}
