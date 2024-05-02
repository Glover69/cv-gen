import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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


  @ViewChild('content') content!: ElementRef;
}
