import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
// import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-personal-info-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personal-info-form.component.html',
  styleUrl: './personal-info-form.component.scss',
})
export class PersonalInfoFormComponent {
  resumeForm!: FormGroup;
  selectedFileUrl: string | null = null;
  customerProfilePhoto!: any;
  profileImageUrl: any;
  selectedFile: File | null = null;
  @Output() formDataChange = new EventEmitter<any>();
  @Output() imageSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.initForm();

    // Subscribe to form value changes
    this.resumeForm.valueChanges.subscribe((value) => {
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
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      this.selectedFileUrl = URL.createObjectURL(this.selectedFile);
      console.log(this.selectedFileUrl);
      localStorage.setItem('profileImage', this.selectedFileUrl);

      this.imageSelected.emit(this.selectedFileUrl);

      const reader = new FileReader();
      reader.onload = () => {
        // Convert the selected file to a base64 string
        const result = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveForm(): void {
    // Authentication will go here in case the user hasnt logged in. 
    // If they have,both image and data will be saved to the database
  }

}
