import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private textColorSubject = new BehaviorSubject<string>('#000'); // Default text color
  textColor$ = this.textColorSubject.asObservable();

  constructor() { }

  setTextColor(color: string): void {
    localStorage.setItem('textColor', color);
    this.textColorSubject.next(color);
  }
}
