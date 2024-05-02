import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
// import jspdf from 'jspdf';
// import html2canvas from 'html2canvas';
// import print from 'print-js'


@Component({
  selector: 'app-template-one',
  standalone: true,
  imports: [],
  templateUrl: './template-one.component.html',
  styleUrl: './template-one.component.scss'
})
export class TemplateOneComponent {

  constructor(private dataService: DataService){}

  @Input() backgroundColor!: string;
  @Input() mainTextColor!: string;

  exportToPdf(): void {
    const htmlContent = document.getElementById('cvContent')?.innerHTML;
    this.dataService.generatePdf(htmlContent)
      .subscribe((pdfBlob: Blob) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(pdfBlob);
        downloadLink.download = 'cv.pdf';
        downloadLink.click();
      }, (error) => {
        console.error('Error converting to PDF:', error);
      });
  }

  @ViewChild('content') content!: ElementRef;



}
