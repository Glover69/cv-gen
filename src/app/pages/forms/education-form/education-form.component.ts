import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(){
    this.initForm();
  }

  initForm(): void {
    this.educationForm = this.fb.group({
      profile: [''],
      skills: this.fb.array([]),
      experiences: this.fb.array([]),
    })
  }
}
