import {
  Component,
  Injector,
  EventEmitter,
  Output,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Type,
  Input,
} from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TemplateOneComponent } from '../../../assets/templates/template-one/template-one.component';
import { TemplateOnePreviewComponent } from '../../components/preview-templates/template-one-preview/template-one-preview.component';
import { TemplateTwoPreviewComponent } from '../../components/preview-templates/template-two-preview/template-two-preview.component';
import { TemplateThreePreviewComponent } from '../../components/preview-templates/template-three-preview/template-three-preview.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ColorService } from '../../../services/color.service';
import { CvEditorComponent } from '../cv-editor/cv-editor.component';
import { TemplateTwoComponent } from '../../../assets/templates/template-two/template-two.component';

type ColorGroup = {
  colorName: string;
  colorHex: string;
};

@Component({
  selector: 'app-cv-builder',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    TemplateOneComponent,
    TemplateOnePreviewComponent,
    TemplateTwoPreviewComponent,
    TemplateThreePreviewComponent,
  ],
  templateUrl: './cv-builder.component.html',
  styleUrl: './cv-builder.component.scss',
})
export class CvBuilderComponent {
  constructor(
    public injector: Injector,
    private colorService: ColorService,
    private router: Router,
    private cvEditor: CvEditorComponent,
  ) {

    // this.templateInjector = Injector.create({
    //   providers: [
    //     { provide: 'formData', useValue: this.formData },
    //     { provide: 'experienceFormData', useValue: this.experienceFormData },
    //     { provide: 'educationFormData', useValue: this.educationFormData },
    //     { provide: 'selectedImageUrl', useValue: this.selectedImageUrl }
    //   ],
    //   parent: this.injector
    // });
  }

  // templateComponent: Type<any> = TemplateOneComponent;
  // templateInjector: Injector;

  @Input() formData: any;
  @Input() experienceFormData: any;
  @Input() educationFormData: any;
  @Input() selectedImageUrl!: string;

  @Output() templateSelected = new EventEmitter<any>();

  onTemplateSelected(templateName: string): void {
    let templateComponent: any;
    let bindings: any = {};
  
    switch (templateName) {
      case 'template-one':
        templateComponent = TemplateOneComponent;
        break;
      case 'template-two':
        templateComponent = TemplateTwoComponent;
        break;
      case 'template-three':
        templateComponent = TemplateOneComponent; // Corrected assignment
        break;
      default:
        templateComponent = TemplateOneComponent; // Default template
        break;
    }
  
    // Assign bindings (common for all templates)
    bindings = {
      formData: this.formData,
      experienceFormData: this.formData,
      educationFormData: this.formData,
      selectedImageUrl: this.selectedImageUrl,
    };
  
    this.templateSelected.emit({ templateComponent, bindings });
  }
  
  

  // selectTemplate(template: Type<any>): void {
  //   this.templateSelected.emit(template);
  // }
  

  ngOnInit() {
    // Retrieve selected colors from Local Storage if available
    this.selectedBackgroundColor =
      localStorage.getItem('selectedBackgroundColor') || '#ffffff';
    this.selectedHeaderColor =
      localStorage.getItem('selectedHeaderColor') || '#000000';
  }

  colorGroup: ColorGroup[] = [
    { colorHex: '#98A2B3', colorName: 'Slate Gray' },
    { colorHex: '#B57EDC', colorName: 'Floral Lavender' },
    { colorHex: '#F97066', colorName: 'Floral Lavender' },
    { colorHex: '#FDB022', colorName: 'Floral Lavender' },
    { colorHex: '#32D583', colorName: 'Floral Lavender' },
    { colorHex: '#717BBC', colorName: 'Floral Lavender' },
    { colorHex: '#36BFFA', colorName: 'Floral Lavender' },
    { colorHex: '#53B1FD', colorName: 'Floral Lavender' },
    { colorHex: '#8098F9', colorName: 'Floral Lavender' },
    { colorHex: '#9B8AFB', colorName: 'Floral Lavender' },
    { colorHex: '#F670C7', colorName: 'Floral Lavender' },
    { colorHex: '#FD6C9E', colorName: 'Floral Lavender' },
    { colorHex: '#FD853A', colorName: 'Floral Lavender' },
  ];

  selectedTemplateType: string | null = null;

  createInjector(template: any): Injector {
    const inputValues = {
      backgroundColor: this.selectedBackgroundColor,
      mainTextColor: this.selectedHeaderColor,
    };
    return Injector.create({
      providers: [
        { provide: 'template', useValue: template },
        { provide: 'inputValues', useValue: inputValues },
      ],
      parent: this.injector,
    });
  }

  // templates = [
  //   { type: 'one', component: TemplateOnePreviewComponent, showButton: false },
  //   { type: 'two', component: TemplateTwoPreviewComponent, showButton: false },
  //   { type: 'three', component: TemplateThreePreviewComponent, showButton: false }
  //   // Add more templates as needed
  // ];

  // setHoveredTemplateType(type: string | null) {
  //   this.selectedTemplateType = type;
  // }

  // toggleButton(index: number) {
  //   this.templates[index].showButton = !this.templates[index].showButton;
  // }

  selectedBackgroundColor: string = '#ffffff'; // Initial background color
  selectedHeaderColor: string = '#000000'; // Initial header color
  showButton: boolean = false;

  selectColor(color: string) {
    this.selectedBackgroundColor = color;
    this.selectedHeaderColor = color;

    this.colorService.setTextColor(color);

    // Store selected colors in Local Storage
    localStorage.setItem(
      'selectedBackgroundColor',
      this.selectedBackgroundColor
    );
    localStorage.setItem('selectedHeaderColor', this.selectedHeaderColor);
  }

  selectedComponent: string | null = null;

  selectComponent(componentId: string): void {
    this.selectedComponent = componentId;
  }

  navigateToSelectedComponent(): void {
    if (this.selectedComponent) {
      this.router.navigate(['/selected-component', this.selectedComponent]);
    }
  }

  // selectComponent(componentId: string): void {
  //   this.componentSelected.emit(componentId);
  // }

  printCV() {
    window.print();
  }
}
