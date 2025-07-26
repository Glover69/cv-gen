import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { ResumeDataService } from '../../../../services/resume-data.service';
import { debounceTime, map, switchMap, take, withLatestFrom } from 'rxjs';
// import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-personal-info-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personal-info-form.component.html',
  styleUrl: './personal-info-form.component.scss',
})
export class PersonalInfoFormComponent implements OnInit {
  resumeForm!: FormGroup;
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeDataService
  ) {
    const data = this.resumeService.getCurrentCVData();

    this.resumeForm = this.fb.group({
      firstname: [data.firstname || ''],
      lastname: [data.lastname || ''],
      email: [data.email || ''],
      phone: [data.phone || ''],
      jobTitle: [data.jobTitle || ''],
      website: [data.website || ''],
      showWebsite: [false],
      linkedIn: [data.linkedIn || ''],
      showLinkedIn: [true],
      github: [data.github || ''],
      showGitHub: [false],
      selectedImageUrl: [this.selectedFileUrl || ''],
    });


    // REPLACE the old pipe with this one
    this.resumeForm.valueChanges
      .pipe(
        debounceTime(50), // Keep debouncing for performance
        withLatestFrom(this.resumeService.cvData$), // Get the latest data from the service
        map(([formValue, currentCvData]) => {
          // Merge the form changes with the current CV data
          return { ...currentCvData, ...formValue };
        })
      )
      .subscribe((updatedData) => {
        // Now, update the service with the fully merged data
        this.resumeService.updateCVData({
          ...updatedData,
          selectedImageUrl: this.selectedFileUrl
        });
      });

  }

  ngOnInit() {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      this.selectedFileUrl = URL.createObjectURL(this.selectedFile);
      console.log(this.selectedFileUrl);
      localStorage.setItem('profileImage', this.selectedFileUrl);

      

      // this.imageSelected.emit(this.selectedFileUrl);

      const reader = new FileReader();
      reader.onload = () => {
        // Convert the selected file to a base64 string
        const result = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // onContinueClick(nextStep: number): void {
  //   // Save formData to localStorage
  //   // localStorage.setItem('formData', JSON.stringify(this.formData));
  //   this.updateFormData(this.formData);
  //   this.continueClicked.emit({ formData: this.formData, nextStep });
  // }
}
