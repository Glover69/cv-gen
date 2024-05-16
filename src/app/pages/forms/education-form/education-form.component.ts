import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-education-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './education-form.component.html',
  styleUrl: './education-form.component.scss'
})
export class EducationFormComponent {

  educationForm!: FormGroup;
  @Output() formDataChange = new EventEmitter<any>();
  @Input() formData: any;
  @Output() continueClicked = new EventEmitter<{ formData: any, nextStep: number }>(); // Emit event when continue button is clicked


  constructor(private fb: FormBuilder, private dataService: DataService) {

  }

  ngOnInit(){
    this.initForm();

    const initialEducation = this.formData.education;
    console.log(initialEducation);

    if(initialEducation?.length >= 1){
      this.setEducation(initialEducation);
    }
      // // Subscribe to form value changes
      this.educationForm.valueChanges.subscribe((value) => {
        // Emit the updated form data
        this.formDataChange.emit(value);
      });
  }

  setEducation(education: any[]) {
    const educationFormArray = this.educationForm.get('education') as FormArray;
    if (education) {
      education.forEach(edu => {
        educationFormArray.push(this.fb.group({
          institution: [edu.institution],
          certification: [edu.certification],
          fieldOfStudy: [edu.fieldOfStudy],
          startDate: [edu.startDate],
          endDate: [edu.endDate],
        }));
      });
    }
  }

  updateFormData(newData: any): void {
    // Update local formData
    this.formData = newData;
    // Emit updated formData to parent
    this.formDataChange.emit(newData);
  }

  onContinueClick(nextStep: number): void {
    this.updateFormData(this.formData);
    this.continueClicked.emit({ formData: this.formData, nextStep });
  }

  onPreviousClick(nextStep: number): void {
    this.updateFormData(this.formData);
    this.continueClicked.emit({ formData: this.formData, nextStep });
  }

  handleFormChange(formData: any): void {
    this.formDataChange.emit(formData);
    // this.dataService.updateFormData(formData);
  }

  initForm(): void {
    this.educationForm = this.fb.group({
      education: this.fb.array([]),
    })
  }

  get educationSectionFormArray(): any[] {
    return (this.educationForm.get('education') as FormArray).controls;
  }


  addEducation(): void {
    const education = this.educationForm.get('education') as FormArray;
    education.push(this.createEducation());
  }

  removeEducation(index: number): void {
    const education = this.educationForm.get('education') as FormArray;
    education.removeAt(index);
  }


  createEducation(): FormGroup {
    return this.fb.group({
      institution: [''],
      certification: [''],
      fieldOfStudy: [''],
      startDate: [''],
      endDate: [''],
    });
  }
}
