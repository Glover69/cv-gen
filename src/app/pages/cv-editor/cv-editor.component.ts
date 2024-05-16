import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Inject,
  Injector,
  Input,
  Output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TemplateThreePreviewComponent } from '../../components/preview-templates/template-three-preview/template-three-preview.component';
import { TemplateOneComponent } from '../../../assets/templates/template-one/template-one.component';
import { CommonModule, DOCUMENT, NgComponentOutlet } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PersonalInfoFormComponent } from '../forms/personal-info-form/personal-info-form.component';
import { CvBuilderComponent } from '../cv-builder/cv-builder.component';
import { ExperienceFormComponent } from '../forms/experience-form/experience-form.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ColorService } from '../../../services/color.service';
import { EducationFormComponent } from '../forms/education-form/education-form.component';
import { DataService } from '../../../services/data.service';
import { TemplateTwoComponent } from '../../../assets/templates/template-two/template-two.component';
import { AuthService, User } from '@auth0/auth0-angular';
import { AuthUserInfo } from '../../../models/data.models';
import { map, Observable } from 'rxjs';

type Steps = {
  icon: string;
  name: string;
  route: string;
};

@Component({
  selector: 'app-cv-editor',
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
    NgComponentOutlet
  ],
  templateUrl: './cv-editor.component.html',
  styleUrl: './cv-editor.component.scss',
})
export class CvEditorComponent {
  user!: User | null | undefined;
  currentStepIndex = 0;
  selectedFileUrl: string | null = null;
  customerProfilePhoto!: any;
  selectedFile: File | null = null;
  isTemplateDialogOpen: boolean = false;
  resumeForm!: FormGroup;
  @ViewChild('templateHost', { read: ViewContainerRef })
  templateHost!: ViewContainerRef;
  @Output() templateSelected = new EventEmitter<Type<any>>();
  selectedTemplate: Type<any> | null = null;
  // @Output() imageSelected = new EventEmitter<string>();


  @Input() experienceFormData: any;
  @Input() educationFormData: any;
  selectedImageUrl: string = '';

  onImageSelected(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
    console.log(this.selectedImageUrl);
  }

  openTemplateDialog(): void {
    this.isTemplateDialogOpen = !this.isTemplateDialogOpen;
  }

  onTemplateSelected(event: { templateComponent: any; bindings: any }): void {
    // const { templateComponent, bindings } = event;
    this.loadTemplate(event);
  }

  templateOne: any;
  templateComponent: Type<any> = TemplateTwoComponent;

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({ 
      logoutParams: {
        returnTo: this.document.location.origin 
      }
    });
  }

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private resolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    public auth: AuthService,
    @Inject(DOCUMENT) public document: Document,
  ) {
     this.templateOne = TemplateTwoComponent;

  }

  // selectTemplate(templateComponent: Type<any>, bindings: any): void {
  //   this.templateSelected.emit(templateComponent);
  // }

  loadTemplate(event: { templateComponent: any; bindings: any }): void {
    const { templateComponent, bindings } = event;
    // Clear previous component
    this.templateHost.clear();

    // Create component factory
    const componentFactory =
      this.resolver.resolveComponentFactory(templateComponent);

    // Create component instance
    const componentRef = this.templateHost.createComponent(componentFactory);

    console.log('Component Instance:', componentRef.instance);

    // Pass bindings to the component instance
    const instance = componentRef.instance as any; // Type assertion
    Object.keys(bindings).forEach((key) => {
      instance[key] = bindings[key];
    });
  }

  formData: any;

  handleContinueClick(event: { formData: any; nextStep: number }): void {
    this.formData = event.formData;
    this.currentStepIndex = event.nextStep;
    console.log(this.formData, this.currentStepIndex);
  }

  handleFormDataChange(formData: any): void {
    const updatedFormData = { ...this.dataService.getFormData(), ...formData, ...this.educationFormData, ...this.experienceFormData, };
    this.dataService.updateFormData(updatedFormData);
  }

  ngOnInit() {
    this.dataService.getFormData().subscribe((newData) => {
      console.log('Received form data:', newData);
      this.formData = { ...this.formData, ...newData };
    });

    this.auth.user$.subscribe(user => {
      this.user = user; // Assign the user information to the user property
      console.log(this.user);
    });
    // this.formData = this.dataService.getFormData();
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
