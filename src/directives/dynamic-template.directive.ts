import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicTemplate]',
  standalone: true
})
export class DynamicTemplateDirective {

  constructor(public viewContainerRef: ViewContainerRef) {}


}
