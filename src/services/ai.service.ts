import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AIService {

  private baseUrl = 'http://localhost:2005'; // Update with your backend API URL

  constructor(private http: HttpClient) { }


  generateContent(prompt: any) {
    return this.http.post<any>(`${this.baseUrl}/api/ai/generate-content`, { prompt });
  }
}
