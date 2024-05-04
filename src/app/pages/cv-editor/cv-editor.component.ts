import { Component, EventEmitter, Output } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TemplateThreePreviewComponent } from '../../components/preview-templates/template-three-preview/template-three-preview.component';
import { TemplateOneComponent } from '../../../assets/templates/template-one/template-one.component';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

type Steps = {
  icon: string;
  name: string;
}

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [CommonModule, NavbarComponent, TemplateThreePreviewComponent, TemplateOneComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './cv-editor.component.html',
  styleUrl: './cv-editor.component.scss'
})
export class CvEditorComponent {

  currentStepIndex = 0;
  selectedFileUrl: string | null = null;
  customerProfilePhoto!: any;
  selectedFile: File | null = null;
  isChecked: boolean = false;
  resumeForm!: FormGroup;
  @Output() imageSelected = new EventEmitter<string>();


  constructor(private fb: FormBuilder){
  }


  initForm(): void {
    this.resumeForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      jobTitle: [''],
      website: [''],
      email: [''],
      phone: [''],
      profile: [''],
      profileImage: [''],
      skills: this.fb.array([]),
      experiences: this.fb.array([]),
      educations: this.fb.array([]),
    });
  }

  addExperience(): void {
    const experiences = this.resumeForm.get('experiences') as FormArray;
    experiences.push(this.createExperience());
  }

  removeExperience(index: number): void {
    const experiences = this.resumeForm.get('experiences') as FormArray;
    experiences.removeAt(index);
  }

  createExperience(): FormGroup {
    return this.fb.group({
      company: [''],
      position: [''],
      location: [''],
      type: [''],
      startDate: [''],
      endDate: [''],
      responsibilities: this.fb.array([])
    });
  }

  addEducation(): void {
    const educations = this.resumeForm.get('educations') as FormArray;
    educations.push(this.createEducation());
  }

  removeEducation(index: number): void {
    const educations = this.resumeForm.get('educations') as FormArray;
    educations.removeAt(index);
  }

  createEducation(): FormGroup {
    return this.fb.group({
      institution: [''],
      degree: [''],
      fieldOfStudy: [''],
      startDate: [''],
      endDate: ['']
    });
  }


  selectedBackgroundColor: string = '#ffffff'; // Initial background color
  selectedHeaderColor: string = '#000000'; // Initial header color

  ngOnInit(){
    // Retrieve selected colors from Local Storage if available
    this.selectedBackgroundColor = localStorage.getItem('selectedBackgroundColor') || '#ffffff';
    this.selectedHeaderColor = localStorage.getItem('selectedHeaderColor') || '#000000';
    this.initForm();

  }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      this.selectedFileUrl = URL.createObjectURL(this.selectedFile);
      console.log(this.selectedFileUrl);

      this.imageSelected.emit(this.selectedFileUrl);

      const reader = new FileReader();
      reader.onload = () => {
        // Convert the selected file to a base64 string
        const result = reader.result as string;
     
      };
      reader.readAsDataURL(this.selectedFile);
    }

    
  }



  goToStep(index: number): void {
    this.currentStepIndex = index;
  }

  steps: Steps[] = [
    {icon: '/assets/icons/personal-card.svg', name: 'Personal'},
    {icon: '/assets/icons/receipt-edit.svg', name: 'Experience'},
    {icon: '/assets/icons/teacher.svg', name: 'Education'}
  ]

  printCV(){
    window.print();
  }

  
}
 