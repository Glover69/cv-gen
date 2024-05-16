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
  selectedFileUrl: string | null = null;
  customerProfilePhoto!: any;
  profileImageUrl: any;
  selectedFile: File | null = null;
  @Input() formData: any;
  @Output() formDataChange = new EventEmitter<any>();
  @Output() imageSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() continueClicked = new EventEmitter<{
    formData: any;
    nextStep: number;
  }>(); // Emit event when continue button is clicked
  retrievedImage: any;


  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  updateFormData(newData: any): void {
    this.formData = newData;
    this.formDataChange.emit(newData);
    this.cdr.detectChanges();
  }

  onContinueClick(nextStep: number): void {
    // Save formData to localStorage
    // localStorage.setItem('formData', JSON.stringify(this.formData));
    this.updateFormData(this.formData);
    this.continueClicked.emit({ formData: this.formData, nextStep });
  }

  ngOnInit() {
    // this.initForm();

    // this.dataService.getFormData().subscribe(formData => {
    //   // Update local form data
    //   this.formData = formData;
    // });

    
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

    // const storedFormData = localStorage.getItem('formData');
    // if (storedFormData) {
    //   this.formData = JSON.parse(storedFormData);
    //   this.resumeForm.patchValue({
    //     firstname: this.formData.firstname,
    //     lastname: this.formData.lastname,
    //     jobTitle: this.formData.jobTitle,
    //   });
    //   this.cdr.detectChanges();

    // }


    // const storedImage = localStorage.getItem('profileImage');
    // if (storedImage) {
    //   this.retrievedImage = storedImage;
    //   console.log(this.retrievedImage)
    //   this.resumeForm.patchValue({
    //     profileImage: this.retrievedImage
    //     // Add other form fields here if needed
    //   });
    //   console.log(this.resumeForm.get('profileImage')?.value);
    // }
    

    // this.formData = JSON.parse(storedFormData);
      this.resumeForm.patchValue({
        firstname: this.formData.firstname,
        lastname: this.formData.lastname,
        jobTitle: this.formData.jobTitle,
        email: this.formData.email,
        showLinkedIn: this.formData.showLinkedIn,
        showGitHub: this.formData.showGitHub,
        showWebsite: this.formData.showWebsite,
        linkedIn: this.formData.linkedIn,
        github: this.formData.github,
        website: this.formData.website,
        phone: this.formData.phone,
      });


    // Subscribe to form value changes
    this.resumeForm.valueChanges.subscribe((value) => {
      // Emit the updated form data
      this.formDataChange.emit(value);
      this.cdr.detectChanges();
    });

    
  }

  handleFormChange(formData: any): void {
    this.formDataChange.emit(formData);
    this.cdr.detectChanges();
    // this.dataService.updateFormData(formData);
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
