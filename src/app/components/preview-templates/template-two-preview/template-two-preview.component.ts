import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-template-two-preview',
  standalone: true,
  imports: [],
  templateUrl: './template-two-preview.component.html',
  styleUrl: './template-two-preview.component.scss'
})
export class TemplateTwoPreviewComponent {

  constructor(private dataService: DataService){}

  @Input() backgroundColor!: string;
  @Input() mainTextColor!: string;
  @Output() componentSelected = new EventEmitter<string>();

  selectComponent(componentId: string): void {
    this.componentSelected.emit(componentId);
  }
  


  @ViewChild('content') content!: ElementRef;

}
