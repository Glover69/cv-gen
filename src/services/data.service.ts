import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'http://localhost:2005'; // Update with your backend API URL

  constructor(private http: HttpClient) { }

  generatePdf(htmlContent: any) {
    return this.http.post(`${this.baseUrl}/api/cv-generator/html-to-pdf`, { html: htmlContent }, { responseType: 'blob' });
  }
}
