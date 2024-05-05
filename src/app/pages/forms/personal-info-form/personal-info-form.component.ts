import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-personal-info-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personal-info-form.component.html',
  styleUrl: './personal-info-form.component.scss'
})
export class PersonalInfoFormComponent {

  resumeForm!: FormGroup;
  selectedFileUrl: string | null = null;
  customerProfilePhoto!: any;
  selectedFile: File | null = null;
  @Output() formDataChange = new EventEmitter<any>();
  @Output() imageSelected: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private fb: FormBuilder, private dataService: DataService){

    
  }

  ngOnInit(){
    this.initForm();

    this.retrieveForm();

    // Subscribe to form value changes
    this.resumeForm.valueChanges.subscribe(value => {
      // Emit the updated form data
      this.formDataChange.emit(value);
    });
  }


  initForm(): void {
    this.resumeForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      jobTitle: [''],
      showLinkedIn: [true],
      linkedIn: [''],
      showWebsite: [false],
      website: [''],
      showGitHub: [false],
      github: [''],
      email: [''],
      phone: [''],
      profile: [''],
      profileImage: [],
      skills: this.fb.array([]),
      experiences: this.fb.array([]),
      educations: this.fb.array([]),
    });
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

        this.resumeForm.patchValue({
          profileImage: result
      });
     
      };
      reader.readAsDataURL(this.selectedFile);
    }

    
  }

  saveForm(): void {
    this.dataService.saveFormData(this.resumeForm, 'myFormDataKey');
  }

  retrieveForm(): void {
    const formDataJson = this.dataService.getFormData('myFormDataKey');
    if (formDataJson) {
      // const retrievedForm = JSON.parse(formDataJson);
      console.log(formDataJson.value);
      this.resumeForm.patchValue(formDataJson.value);
    } else {
      console.log('No form data found in localStorage');
    }
  }
  
  
}
