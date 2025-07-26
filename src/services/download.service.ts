import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl // 🔁 Replace with your actual backend URL

  downloadPdf(templateName: string, data: any) {
    return this.http.post(
      `${this.baseUrl}/api/cv-gen/download`,
      { templateName, data },
      {
        responseType: 'blob', // 👈 Important for binary PDF data
      }
    );
  }
}
