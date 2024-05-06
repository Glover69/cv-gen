import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
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
      skills: this.fb.array([]),
      experiences: this.fb.array([]),
    })
  }

  get skills(): FormArray {
    return this.experienceForm.get('skills') as FormArray;
  }

  get experienceSectionFormArray(): any[] {
    return (this.experienceForm.get('experiences') as FormArray).controls;
  }


getRandomColor(): { mainColor: string, lighterColor: string, filter: string } {
  // Array of predefined colors and their lighter shades
  const colors = [
    { mainColor: '#B42318', lighterColor: '#FEE4E2', filter: 'invert(70%) sepia(71%) saturate(3896%) hue-rotate(348deg) brightness(70%) contrast(101%)' },  // Example colors, you can add more
    { mainColor: '#1172CC', lighterColor: '#EDF6FF', filter: 'invert(66%) sepia(85%) saturate(1393%) hue-rotate(189deg) brightness(97%) contrast(70%)' },
    { mainColor: '#FD6C9E', lighterColor: '#FBDFE8', filter: 'invert(35%) sepia(7%) saturate(5902%) hue-rotate(300deg) brightness(102%) contrast(98%)' },
    { mainColor: '#98A2B3', lighterColor: '#F0F0F0', filter: 'invert(30%) sepia(6%) saturate(736%) hue-rotate(179deg) brightness(88%) contrast(87%)' },
    { mainColor: '#9B8AFB', lighterColor: '#F0EDFF', filter: 'invert(36%) sepia(17%) saturate(7014%) hue-rotate(213deg) brightness(103%) contrast(97%)' },
    { mainColor: '#32D583', lighterColor: '#DEF4E9', filter: 'invert(30%) sepia(39%) saturate(814%) hue-rotate(95deg) brightness(97%) contrast(80%)' },
    { mainColor: '#FDB022', lighterColor: '#FFF2DA', filter: 'invert(20%) sepia(19%) saturate(5028%) hue-rotate(340deg) brightness(101%) contrast(98%)' },
    { mainColor: '#B57EDC', lighterColor: '#EDDEF9', filter: 'invert(43%) sepia(70%) saturate(867%) hue-rotate(219deg) brightness(91%) contrast(89%)' },

    // Add more colors here as needed
  ];

  // console.log(colors[0].filter)

  // Randomly select a color from the array
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

@ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;

addSkill(skill: string): void {
  if (skill.trim()) {
    // const randomColor = this.getRandomColor();

    const { mainColor, lighterColor, filter } = this.getRandomColor();
    this.skills.push(this.fb.group({
      name: skill.trim(),
      color: mainColor,
      backgroundColor: lighterColor,
      filter: filter
    }));
  }

  this.skillInput.nativeElement.value = '';
}


removeSkill(index: number): void {
  this.skills.removeAt(index);
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

}
