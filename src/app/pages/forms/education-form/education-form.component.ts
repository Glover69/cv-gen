import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { AuthService, User } from '@auth0/auth0-angular';
import { SavedUser } from '../../../../models/data.models';
import { UtilityService } from '../../../../services/utility.service';

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
  user!: User | null | undefined;
  savedUser!: SavedUser;
  sanitizedData: any;


  constructor(private fb: FormBuilder, private utilityService: UtilityService, public auth: AuthService, private dataService: DataService) {

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

      // console.log(this.formData);
      
      
      if(this.auth.user$){
        this.auth.user$.subscribe(user => {
          this.user = user; // Assign the user information to the user property
          console.log(this.user);
  
          const email = this.user?.email
          const isEmailVerified = this.user?.email_verified;
          const profile = this.user?.picture;
          const fullname = this.user?.name;
          const authID = this.user?.sub;

          this.dataService.getUserByAuthID(authID).subscribe({
            next: (res: SavedUser) => {
              console.log('User:', res);
              this.savedUser = res;
            },
            error: (err: Error) => {
              console.log('Error fetching user:', err);
            }
          })
        });
      }

      const sanitizedData = this.utilityService.sanitizeData(this.formData);
      try {
        console.log(JSON.stringify(sanitizedData));
        this.sanitizedData = sanitizedData;
      } catch (error) {
        console.error('Error serializing sanitized data:', error);
      }


      
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

  saveToCollection(){
    const resume = this.sanitizedData

    // const resume = JSON.parse(JSON.stringify(this.formData));
    console.log(resume);

    if(this.savedUser.collectionID){
      const collectionID = this.savedUser.collectionID;

    this.dataService.saveToCollection(collectionID, resume).subscribe({
      next: (res) => {
        console.log('CV added to collection successfully:', res);
      },
      error: (err: Error) => {
        console.error('Error adding file:', err);
      }
    })
    }
  }
}
