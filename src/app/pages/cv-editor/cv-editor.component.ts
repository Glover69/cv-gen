import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Injector,
  Input,
  NgZone,
  Type,
  ViewChild,
} from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TemplateThreePreviewComponent } from '../../components/preview-templates/template-three-preview/template-three-preview.component';
import { TemplateOneComponent } from '../../../assets/templates/template-one/template-one.component';
import { CommonModule, DOCUMENT, NgComponentOutlet } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PersonalInfoFormComponent } from '../forms/personal-info-form/personal-info-form.component';
import { CvBuilderComponent } from '../cv-builder/cv-builder.component';
import { ExperienceFormComponent } from '../forms/experience-form/experience-form.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { EducationFormComponent } from '../forms/education-form/education-form.component';
import { DataService } from '../../../services/data.service';
import { AuthService, User } from '@auth0/auth0-angular';
import { DynamicTemplateDirective } from '../../../directives/dynamic-template.directive';
import { TemplateSelectionService } from '../../../services/template-selection.service';
import { ToastService } from '../../../services/toast.service';
// import * as html2pdf from 'html2pdf.js';

declare var html2pdf: any;



type Steps = {
  icon: string;
  name: string;
  route: string;
};

@Component({
  selector: 'app-cv-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    TemplateThreePreviewComponent,
    TemplateOneComponent,
    ReactiveFormsModule,
    FormsModule,
    PersonalInfoFormComponent,
    CvBuilderComponent,
    ExperienceFormComponent,
    RouterOutlet,
    RouterModule,
    EducationFormComponent,
    NgComponentOutlet,
    DynamicTemplateDirective
  ],
  templateUrl: './cv-editor.component.html',
  styleUrl: './cv-editor.component.scss',
})
export class CvEditorComponent {
  formData: any;
  user!: User | null | undefined;
  currentStepIndex = 0;
  selectedFileUrl: string | null = null;
  customerProfilePhoto!: any;
  selectedFile: File | null = null;
  isTemplateDialogOpen: boolean = false;
  resumeForm!: FormGroup;
  selectedTemplate: Type<any> | null = null;
  selectedImageUrl: string = '';
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  isProfileDialogOpen: boolean = false;
  


  generatePDF() {

    const element = this.pdfContent.nativeElement;

    // Temporarily apply a transformation for PDF generation
    element.style.transform = 'scale(1)'; // Scale content by 1.5 times
    element.style.transformOrigin = 'top left'; // Ensure scaling from the top left corner

    const options = {
      margin: 0.5,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      // html2canvas: { scale: 5 },
      html2canvas: { 
        scale: 2, // Higher scale means better quality
        logging: false, // Disable logging for performance
        useCORS: true // Enable cross-origin resource sharing
      },
      enableLinks: true,
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
    };

    html2pdf().from(this.pdfContent.nativeElement).set(options).save().then(() => {
      // Reset the transformation after generating the PDF
      element.style.transform = 'none';
    });;
  }

  onImageSelected(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
    console.log(this.selectedImageUrl);
  }

  openTemplateDialog(): void {
    this.isTemplateDialogOpen = !this.isTemplateDialogOpen;
  }

  openProfileDialog(): void {
    this.isProfileDialogOpen = !this.isProfileDialogOpen;
  }

  login() {
    // this.auth.loginWithRedirect();
  }

  logout() {
    // this.auth.logout({ 
    //   logoutParams: {
    //     returnTo: this.document.location.origin 
    //   }
    // });
  }

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    public auth: AuthService,
    private templateSelectionService: TemplateSelectionService,
    @Inject(DOCUMENT) public document: Document,
    private toastService: ToastService
  ) {

  }

  dynamicComponentInjector() {
    return Injector.create({
      providers: [
        { provide: 'formData', useValue: this.formData },
        { provide: 'selectedImageUrl', useValue: this.selectedImageUrl }
      ],
      parent: this.injector
    });
  }




  handleContinueClick(event: { formData: any; nextStep: number }): void {
    this.formData = event.formData;
    this.currentStepIndex = event.nextStep;
    console.log(this.formData, this.currentStepIndex);
  }


  handleFormDataChange(formData: any): void {
    const currentFormData = this.dataService.getFormData();
    const updatedFormData = { ...currentFormData, ...formData };
    this.dataService.updateFormData(updatedFormData);
  }
  

  ngOnInit() {
    this.dataService.getFormData().subscribe((newData) => {
      console.log('Received form data:', newData);
      this.formData = { ...this.formData, ...newData };
    });

    this.templateSelectionService.getSelectedTemplate().subscribe(template => {
      this.selectedTemplate = template?.templateComponent;

      if(template?.templateComponent){
        console.log('yes')
        this.toastService.showToast(
          'Template applied🎉',
        );
      }else{
        console.log('no');
        this.toastService.showToast(
          'Template error',
          `An error occurred while applying this template. Please choose another.`
        );
      }
    });

    // if(this.auth.user$){
    //   this.auth.user$.subscribe(user => {
    //     this.user = user; // Assign the user information to the user property
    //     console.log(this.user);

    //     const email = this.user?.email
    //     const isEmailVerified = this.user?.email_verified;
    //     const profile = this.user?.picture;
    //     const fullname = this.user?.name;
    //     const authID = this.user?.sub;

    //     const payload = {
    //       email, isEmailVerified, profile, fullname, authID
    //     }


    //     this.dataService.addUser(payload).subscribe({
    //       next: (response: any) => {
    //         console.log('User added successfully!', response);
    //       },
    //       error: (err: any) => {
    //         console.log('Error adding user.', err);
    //       }
    //     })
        
    //   });
    // }
  }


  goToStep(index: number): void {
    this.currentStepIndex = index;
  }

  steps: Steps[] = [
    {
      icon: '/assets/icons/personal-card.svg',
      name: 'Personal',
      route: 'personal',
    },
    {
      icon: '/assets/icons/receipt-edit.svg',
      name: 'Experience',
      route: 'experience',
    },
    {
      icon: '/assets/icons/teacher.svg',
      name: 'Education',
      route: 'education',
    },
  ];

  printCV() {
    window.print();
  }
}
