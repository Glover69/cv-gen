import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-template-one-preview',
  standalone: true,
  imports: [],
  templateUrl: './template-one-preview.component.html',
  styleUrl: './template-one-preview.component.scss'
})
export class TemplateOnePreviewComponent {

  constructor(private dataService: DataService){}

  @Input() backgroundColor!: string;
  @Input() mainTextColor!: string;


  @ViewChild('content') content!: ElementRef;

}
