import { Component, Injector, Input } from '@angular/core';
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
import { TemplateSelectionService } from '../../../services/template-selection.service';
import { ResumeDataService } from '../../../services/resume-data.service';

type ColorGroup = {
  colorName: string;
  colorHex: string;
};

@Component({
  selector: 'app-cv-builder',
  standalone: true,
  imports: [
    CommonModule,
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
    private resumeDataService: ResumeDataService,
    private colorService: ColorService,
    private router: Router,
    private templateSelectionService: TemplateSelectionService
  ) {}

  @Input() formData: any;
  @Input() experienceFormData: any;
  @Input() educationFormData: any;
  @Input() selectedImageUrl!: string;

  onTemplateSelected(templateName: string | null) {
    let templateComponent: any;

    switch (templateName) {
      case 'template-one':
        templateComponent = TemplateOneComponent;
        break;
      case 'template-two':
        templateComponent = TemplateTwoComponent;
        break;
      case 'template-three':
        templateComponent = TemplateTwoComponent;
        break;
      default:
        templateComponent = TemplateOneComponent; // Default to TemplateOneComponent
        break;
    }

    this.templateSelectionService.selectTemplate({ templateComponent });
  }

  ngOnInit() {
    // this.onTemplateSelected(null);
    // Retrieve selected colors from Local Storage if available
    this.selectedBackgroundColor =
      localStorage.getItem('selectedBackgroundColor') || '#ffffff';
    this.selectedHeaderColor =
      localStorage.getItem('selectedHeaderColor') || '#000000';

    // this.selectColor(this.selectedHeaderColor)
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
    // Update the service with the new color
    this.resumeDataService.updateCVData({
      ...this.resumeDataService.getCurrentCVData(),
      textColor: this.selectedHeaderColor,
    });
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

  printCV() {
    window.print();
  }
}
