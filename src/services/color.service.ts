import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private textColorSubject = new BehaviorSubject<string>('#000'); // Default text color
  textColor$ = this.textColorSubject.asObservable();

  constructor() { }

  getCurrentColor(){
    const color = localStorage.getItem('textColor')
    this.updateTextColor(color)
    return this.textColorSubject.value
  }

  updateTextColor(color: string | null): void {
    this.textColorSubject.next(color ?? '#000'); 
  }
  // setTextColor(color: string): void {
  //   localStorage.setItem('textColor', color);
  //   this.textColorSubject.next(color);
  // }

  setTextColor(color: string): void {
    localStorage.setItem('textColor', color);
    this.updateTextColor(color); // Call the updateTextColor method instead
  }
  
}
