import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ResumeDataService } from '../../../../services/resume-data.service';
import { getRandomColor } from '../../../../utilities/utils';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './experience-form.component.html',
  styleUrl: './experience-form.component.scss',
})
export class ExperienceFormComponent {
  experienceForm!: FormGroup;
  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;
  isAIDialogOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private resumeDataService: ResumeDataService
  ) {
    const data = this.resumeDataService.getCurrentCVData();

    this.experienceForm = this.fb.group({
      profile: [data.profile || ''],
      skills: this.fb.array(data.skills || []),
      experiences: this.fb.array(data.experiences || []),
    });

    this.experienceForm.valueChanges.subscribe((val) => {
      this.resumeDataService.updateCVData({
        ...this.resumeDataService.getCurrentCVData(),
        ...val,
      });
    });
  }

  onFormChange(newData: any) {
    const currentData = this.resumeDataService.getCurrentCVData();
    this.resumeDataService.updateCVData({
      ...currentData,
      ...newData,
    });
  }

  openAIDialog() {}

  setSkills(skills: string[]) {
    const skillFormArray = this.experienceForm.get('skills') as FormArray;
    if (skills) {
      skills.forEach((skill) => {
        skillFormArray.push(this.fb.control(skill));
      });
    }
  }

  setExperiences(experiences: any[]) {
    const experienceFormArray = this.experienceForm.get(
      'experiences'
    ) as FormArray;
    if (experiences) {
      experiences.forEach((exp) => {
        experienceFormArray.push(
          this.fb.group({
            jobTitle: [exp.jobTitle],
            company: [exp.company],
            location: [exp.location],
            type: [exp.type],
            startDate: [exp.startDate],
            endDate: [exp.endDate],
            points: this.fb.array([]), // You might need to initialize this array as well if needed
          })
        );
      });
    }
  }

  get skills(): FormArray {
    return this.experienceForm.get('skills') as FormArray;
  }

  get experienceSectionFormArray(): any[] {
    return (this.experienceForm.get('experiences') as FormArray).controls;
  }

  addSkill(skill: string, event: Event): void {
    if (skill.trim()) {
      // const randomColor = this.getRandomColor();

      const { mainColor, lighterColor, filter } = getRandomColor();
      this.skills.push(
        this.fb.group({
          name: skill.trim(),
          color: mainColor,
          backgroundColor: lighterColor,
          filter: filter,
        })
      );
    }

    this.skillInput.nativeElement.value = '';

    event.stopPropagation();
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  addExperience(): void {
    const experiences = this.experienceForm.get('experiences') as FormArray;
    experiences.push(this.createExperience());
  }

  addPoint(experienceIndex: number): void {
    const experience = (this.experienceForm.get('experiences') as FormArray).at(
      experienceIndex
    );
    const points = experience.get('points') as FormArray;
    points.push(this.fb.control(''));
  }

  removeExperience(index: number): void {
    const experiences = this.experienceForm.get('experiences') as FormArray;
    experiences.removeAt(index);
  }

  removePoint(experienceIndex: number, pointIndex: number): void {
    const experience = (this.experienceForm.get('experiences') as FormArray).at(
      experienceIndex
    );
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
