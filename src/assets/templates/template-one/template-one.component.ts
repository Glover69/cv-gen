import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Resume } from '../../../models/data.models';
import { ColorService } from '../../../services/color.service';
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

  constructor(private dataService: DataService, private colorService: ColorService){}
  @Input() formData!: Resume;
  @Input() selectedImageUrl!: string | null;

  selectedImage: File | null = null;

  onImageSelected(image: File): void {
    this.selectedImage = image;
  }

  textColor: string = '';

  ngOnInit() {
    const storedTextColor = localStorage.getItem('textColor');
    if (storedTextColor) {
      this.textColor = storedTextColor;
    }

    // Subscribe to changes in text color
    this.colorService.textColor$.subscribe(color => {
      this.textColor = color;
    });
  }
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
