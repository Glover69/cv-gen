import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Education, EducationGroup, ExperienceGroup, Resume } from '../../../models/data.models';
import { ColorService } from '../../../services/color.service';
// import jspdf from 'jspdf';
// import html2canvas from 'html2canvas';
// import print from 'print-js'


@Component({
  selector: 'app-template-two',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './template-two.component.html',
  styleUrl: './template-two.component.scss'
})
export class TemplateTwoComponent implements OnInit, OnChanges {

  constructor(private dataService: DataService, private colorService: ColorService, private cdr: ChangeDetectorRef){}
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
  skillsAsString: string = '';


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
    this.skillsAsString = this.formData.skills.map(skill => skill.name).join(', ');

  }


  


  ngOnChanges(changes: SimpleChanges): void {
    console.log('formData in ngOnChanges:', this.formData);
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
