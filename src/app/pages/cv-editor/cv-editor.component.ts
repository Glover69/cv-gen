import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Inject,
  Injector,
  Input,
  NgZone,
  Output,
  SimpleChanges,
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
import { map, Observable, Subscription } from 'rxjs';
import { DynamicTemplateDirective } from '../../../directives/dynamic-template.directive';
import { TemplateSelectionService } from '../../../services/template-selection.service';

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
export class CvEditorComponent implements AfterViewChecked {
  user!: User | null | undefined;
  currentStepIndex = 0;
  selectedFileUrl: string | null = null;
  customerProfilePhoto!: any;
  selectedFile: File | null = null;
  isTemplateDialogOpen: boolean = false;
  resumeForm!: FormGroup;
  private templateSubscription!: Subscription;
  // @ViewChild('templateHost', { read: ViewContainerRef })
  // templateHost!: ViewContainerRef;
  // @ViewChild('templateHost', { read: ViewContainerRef }) templateHost: ViewContainerRef;
  @ViewChild(DynamicTemplateDirective, { static: true }) templateHost!: DynamicTemplateDirective;
  selectedTemplate: Type<any> | null = null;

  // @Output() templateSelected = new EventEmitter<Type<any>>();
  // selectedTemplate: Type<any> | null = null;
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

  // onTemplateSelected(event: { templateComponent: any; bindings: any }): void {
  //   // const { templateComponent, bindings } = event;
  //   this.loadTemplate(event);
  // }

  // templateOne: any;
  // templateComponent: Type<any> = TemplateTwoComponent;

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
    private ngZone: NgZone,
    private templateSelectionService: TemplateSelectionService,
    @Inject(DOCUMENT) public document: Document,
  ) {
    //  this.templateOne = TemplateOneComponent;

    //  this.templateSelectionService.getSelectedTemplate().subscribe(template => {
    //   this.templateOne = template;
    // });
    //  this.templateHost = {} as ViewContainerRef; // Initialize templateHost here

  }

  ngAfterViewChecked() {
    // if (!this.templateHost) {
    //   console.error('Template host is not defined', this.templateHost);
    // } else {
    //   // console.log('Template host is defined:', this.templateHost);
    // }
  }

  // selectTemplate(templateComponent: Type<any>, bindings: any): void {
  //   this.templateSelected.emit(templateComponent);
  // }

  loadTemplate(event: {templateComponent: any}){
    // const {templateComponent} = event;

    // this.templateSelectionService.getSelectedTemplateSecond().subscribe(template => {
    //   this.templateOne = template;
    // });
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

  // loadTemplate(event: { templateComponent: any; bindings: any }): void {

  //   if (!this.templateHost) {
  //     console.error('Template host is not available');
  //     return;
  //   }

  //   const { templateComponent, bindings } = event;
  //   console.log(templateComponent, bindings);

  
  //   // Clear previous component
  //   // this.templateHost.clear();
  //   const viewContainerRef = this.templateHost.viewContainerRef;
  //   viewContainerRef.clear();

  //   // Create component factory
  //   // const componentFactory =
  //   //   this.resolver.resolveComponentFactory(templateComponent);

  //     const componentFactory = this.resolver.resolveComponentFactory(templateComponent);


  //   // Create component instance
  //   // const componentRef = this.templateHost.createComponent(componentFactory);
  //   const componentRef = viewContainerRef.createComponent(componentFactory);

  //   console.log('Component Instance:', componentRef.instance);

  //   // Pass bindings to the component instance
  //   const instance = componentRef.instance as any; // Type assertion
  //   Object.keys(bindings).forEach((key) => {
  //     instance[key] = bindings[key];
  //   });

  //   // this.subscribeToFormDataChanges(instance);

  //   // Trigger change detection
  //   // this.cdr.detectChanges();

  //   this.ngZone.run(() => {
  //     this.cdr.detectChanges();
  //   });
  // }

  formData: any;
  

  // subscribeToFormDataChanges(instance: any) {
  //   // Assuming formData is an Observable or a Subject
  //   // You might need to adapt this depending on how your form data is implemented
  //   this.dataService.formDataSubject.subscribe(data => {
  //     instance.formData = data;
  //     this.cdr.detectChanges();
  //   });
  // }


  handleContinueClick(event: { formData: any; nextStep: number }): void {
    this.formData = event.formData;
    this.currentStepIndex = event.nextStep;
    console.log(this.formData, this.currentStepIndex);
  }

  // handleFormDataChange(formData: any): void {
  //   const updatedFormData = { ...this.dataService.getFormData(), ...formData, ...this.educationFormData, ...this.experienceFormData, };
  //   this.dataService.updateFormData(updatedFormData);
  //   this.cdr.detectChanges(); // Manually trigger change detection

  // }

  handleFormDataChange(formData: any): void {
    const currentFormData = this.dataService.getFormData();
    const updatedFormData = { ...currentFormData, ...formData };
    this.dataService.updateFormData(updatedFormData);
    // this.cdr.detectChanges(); // Manually trigger change detection
  }
  

  ngOnInit() {
    this.dataService.getFormData().subscribe((newData) => {
      console.log('Received form data:', newData);
      this.formData = { ...this.formData, ...newData };
      // you might need to trigger this too to make sure it runs change detection so the UI of the dynamic component gets updated
      this.cdr.detectChanges(); // Manually trigger change detection
    });

    this.templateSelectionService.getSelectedTemplate().subscribe(template => {
      this.selectedTemplate = template?.templateComponent;
    });

     // Subscribe to template selection
    //  this.templateSubscription = this.templateSelectionService.templateSelected$.subscribe(event => {
    //   this.loadTemplate(event);
    // });

    this.auth.user$.subscribe(user => {
      this.user = user; // Assign the user information to the user property
      console.log(this.user);
    });
    // this.formData = this.dataService.getFormData();
  }

  // ngOnDestroy() {
  //   // Clean up the subscription
  //   if (this.templateSubscription) {
  //     this.templateSubscription.unsubscribe();
  //   }
  // }

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
