import { Component, EventEmitter, Output } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TemplateThreePreviewComponent } from '../../components/preview-templates/template-three-preview/template-three-preview.component';
import { TemplateOneComponent } from '../../../assets/templates/template-one/template-one.component';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PersonalInfoFormComponent } from '../forms/personal-info-form/personal-info-form.component';
import { CvBuilderComponent } from '../cv-builder/cv-builder.component';
import { ExperienceFormComponent } from '../forms/experience-form/experience-form.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ColorService } from '../../../services/color.service';

type Steps = {
  icon: string;
  name: string;
  route: string;
};

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    TemplateThreePreviewComponent,
    TemplateOneComponent,
    ReactiveFormsModule,
    FormsModule,
    PersonalInfoFormComponent,
    CvBuilderComponent,
    ExperienceFormComponent,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './cv-editor.component.html',
  styleUrl: './cv-editor.component.scss',
})
export class CvEditorComponent {
  currentStepIndex = 0;
  selectedFileUrl: string | null = null;
  customerProfilePhoto!: any;
  selectedFile: File | null = null;
  isTemplateDialogOpen: boolean = false;
  resumeForm!: FormGroup;
  // @Output() imageSelected = new EventEmitter<string>();

  selectedImageUrl: string = '';

  onImageSelected(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
    console.log(this.selectedImageUrl);
  }

  openTemplateDialog(): void {
    this.isTemplateDialogOpen = !this.isTemplateDialogOpen;
  }

  constructor(private fb: FormBuilder, private colorService: ColorService) {}

  formData: any;

  handleFormDataChange(data: any) {
    this.formData = data;
  }

  // addEducation(): void {
  //   const educations = this.resumeForm.get('educations') as FormArray;
  //   educations.push(this.createEducation());
  // }

  // removeEducation(index: number): void {
  //   const educations = this.resumeForm.get('educations') as FormArray;
  //   educations.removeAt(index);
  // }

  // createEducation(): FormGroup {
  //   return this.fb.group({
  //     institution: [''],
  //     degree: [''],
  //     fieldOfStudy: [''],
  //     startDate: [''],
  //     endDate: [''],
  //   });
  // }

  ngOnInit() {
 
  }


  goToStep(index: number): void {
    this.currentStepIndex = index;
  }

  steps: Steps[] = [
    { icon: '/assets/icons/personal-card.svg', name: 'Personal', route: 'personal'},
    { icon: '/assets/icons/receipt-edit.svg', name: 'Experience', route: 'experience'},
    { icon: '/assets/icons/teacher.svg', name: 'Education', route: 'education'},
  ];

  printCV() {
    window.print();
  }
}
