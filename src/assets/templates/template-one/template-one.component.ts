import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, Input, NgZone, OnChanges, OnInit, SimpleChanges, Type, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Education, EducationGroup, ExperienceGroup, Resume } from '../../../models/data.models';
import { ColorService } from '../../../services/color.service';
import { CommonModule } from '@angular/common';
// import jspdf from 'jspdf';
// import html2canvas from 'html2canvas';
// import print from 'print-js'


@Component({
  selector: 'app-template-one',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './template-one.component.html',
  styleUrl: './template-one.component.scss'
})
export class TemplateOneComponent implements OnInit, OnChanges {

 

  constructor(private dataService: DataService, private ngZone: NgZone, private colorService: ColorService, private cdr: ChangeDetectorRef, private injector: Injector){
  }
  @Input() formData!: Resume;
  @Input() experienceFormData!: ExperienceGroup;
  @Input() educationFormData!: EducationGroup;

  @Input() selectedImageUrl!: string | null;
  @Input() selectedColor!: string;
  customerProfilePhoto: any;


  selectedImage: File | null = null;

  onImageSelected(image: File): void {
    this.selectedImage = image;
  }

  textColor: string = '';

  ngOnInit() {
    const storedTextColor = localStorage.getItem('textColor');
    if (storedTextColor) {
      this.textColor = storedTextColor;
      this.colorService.updateTextColor(storedTextColor);
    }

    // Subscribe to changes in text color
    this.colorService.textColor$.subscribe(color => {
      this.textColor = color;
    });

    console.log('formData in ngOnInit:', this.formData);

    this.ngZone.run(() => {
      this.cdr.detectChanges();
    });
  }


  onDataChange() {
    console.log('Form Data changed:', this.formData);
    this.triggerChangeDetection();
  }



  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('formData in ngOnChanges:', this.formData);
  // }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData']) {
      console.log('Form Data changed:', changes['formData'].currentValue);
    }
  }


  private triggerChangeDetection() {
    this.ngZone.run(() => {
      this.cdr.detectChanges();
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
