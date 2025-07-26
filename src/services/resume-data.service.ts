// resume-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResumeDataService {
  private cvDataSource = new BehaviorSubject<any>({});
  cvData$ = this.cvDataSource.asObservable();

  updateCVData(updatedData: any) {
    this.cvDataSource.next(updatedData);
  }

  getCurrentCVData() {
    return this.cvDataSource.value;
  }
}