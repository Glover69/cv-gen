import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './experience-form.component.html',
  styleUrl: './experience-form.component.scss'
})
export class ExperienceFormComponent {

  experienceForm!: FormGroup;
  @Output() formDataChange = new EventEmitter<any>();


  constructor(private fb: FormBuilder){
  
  }

  ngOnInit(){
    this.initForm();

    // Subscribe to form value changes
    this.experienceForm.valueChanges.subscribe((value) => {
      // Emit the updated form data
      this.formDataChange.emit(value);
    });
  }

  initForm(): void {
    this.experienceForm = this.fb.group({
      profile: [''],
      experiences: this.fb.array([]),
    })
  }

  get experienceSectionFormArray(): any[] {
    return (this.experienceForm.get('experiences') as FormArray).controls;
  }

  addExperience(): void {
    const experiences = this.experienceForm.get('experiences') as FormArray;
    experiences.push(this.createExperience());
  }

  addPoint(experienceIndex: number): void {
    const experience = (this.experienceForm.get('experiences') as FormArray).at(experienceIndex);
    const points = experience.get('points') as FormArray;
    points.push(this.fb.control(''));
  }

  removeExperience(index: number): void {
    const experiences = this.experienceForm.get('experiences') as FormArray;
    experiences.removeAt(index);
  }

  removePoint(experienceIndex: number, pointIndex: number): void {
    const experience = (this.experienceForm.get('experiences') as FormArray).at(experienceIndex);
    const points = experience.get('points') as FormArray;
    points.removeAt(pointIndex);
  }

  createExperience(): FormGroup {
    return this.fb.group({
      jobTitle: [''],
      company: [''],
      location: [''],
      type: [''],
      startDate: [''],
      endDate: [''],
      points: this.fb.array([]),
    });
  }

  // createPoint(): FormGroup{
  //   return this.fb.group({

  //   });
  // }
}
