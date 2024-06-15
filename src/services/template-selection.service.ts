// // template-selection.service.ts
// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class TemplateSelectionService {
//   // private templateSelected = new Subject<{ templateComponent: any; bindings: any }>();
//   private templateSelectedSecond = new Subject<{ templateComponent: any;}>();


//   // Observable stream
//   // templateSelected$ = this.templateSelected.asObservable();

//   // Method to emit the template selection
//   // selectTemplate(template: { templateComponent: any; bindings: any }) {
//   //   this.templateSelected.next(template);
//   // }

//   selectTemplateSecond(template: { templateComponent: any;}) {
//     this.templateSelectedSecond.next(template);
//   }
//   getSelectedTemplateSecond() {
//     console.log(this.templateSelectedSecond.asObservable())
//     return this.templateSelectedSecond.asObservable();
//   }
// }

// template-selection.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateSelectionService {
  private templateSelectedSubject = new Subject<{ templateComponent: any }>();

  // Method to emit the selected template
  selectTemplate(template: { templateComponent: any }) {
    this.templateSelectedSubject.next(template);
  }

  // Method to get the observable for the selected template
  getSelectedTemplate() {
    return this.templateSelectedSubject.asObservable();
  }
}

