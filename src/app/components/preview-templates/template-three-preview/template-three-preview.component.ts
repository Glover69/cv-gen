import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-template-three-preview',
  standalone: true,
  imports: [],
  templateUrl: './template-three-preview.component.html',
  styleUrl: './template-three-preview.component.scss'
})
export class TemplateThreePreviewComponent {
  // constructor(private dataService: DataService){}

  @Input() backgroundColor!: string;
  @Input() mainTextColor!: string;
  @Output() componentSelected = new EventEmitter<string>();

  selectComponent(componentId: string): void {
    this.componentSelected.emit(componentId);
  }
  


  @ViewChild('content') content!: ElementRef;
}
