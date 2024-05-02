import { Component, Injector, EventEmitter, Output, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TemplateOneComponent } from '../../../assets/templates/template-one/template-one.component';
import { TemplateOnePreviewComponent } from '../../components/preview-templates/template-one-preview/template-one-preview.component';
import { TemplateTwoPreviewComponent } from '../../components/preview-templates/template-two-preview/template-two-preview.component';
import { TemplateThreePreviewComponent } from '../../components/preview-templates/template-three-preview/template-three-preview.component';
import { CommonModule } from '@angular/common';

type ColorGroup = {
  colorName: string;
  colorHex: string;
}


@Component({
  selector: 'app-cv-builder',
  standalone: true,
  imports: [NavbarComponent, CommonModule, TemplateOneComponent, TemplateOnePreviewComponent, TemplateTwoPreviewComponent, TemplateThreePreviewComponent],
  templateUrl: './cv-builder.component.html',
  styleUrl: './cv-builder.component.scss'
})
export class CvBuilderComponent {

  constructor(public injector: Injector, private resolver: ComponentFactoryResolver) { }


  ngOnInit(){
    // Retrieve selected colors from Local Storage if available
    this.selectedBackgroundColor = localStorage.getItem('selectedBackgroundColor') || '#ffffff';
    this.selectedHeaderColor = localStorage.getItem('selectedHeaderColor') || '#000000';
  }

  colorGroup: ColorGroup[] = [
    {colorHex: '#98A2B3', colorName: 'Slate Gray'},
    {colorHex: '#B57EDC', colorName: 'Floral Lavender'},
    {colorHex: '#F97066', colorName: 'Floral Lavender'},
    {colorHex: '#FDB022', colorName: 'Floral Lavender'},
    {colorHex: '#32D583', colorName: 'Floral Lavender'},
    {colorHex: '#717BBC', colorName: 'Floral Lavender'},
    {colorHex: '#36BFFA', colorName: 'Floral Lavender'},
    {colorHex: '#53B1FD', colorName: 'Floral Lavender'},
    {colorHex: '#8098F9', colorName: 'Floral Lavender'},
    {colorHex: '#9B8AFB', colorName: 'Floral Lavender'},
    {colorHex: '#F670C7', colorName: 'Floral Lavender'},
    {colorHex: '#FD6C9E', colorName: 'Floral Lavender'},
    {colorHex: '#FD853A', colorName: 'Floral Lavender'},
  ]

  selectedTemplateType: string | null = null;

  createInjector(template: any): Injector {
    const inputValues = {
      backgroundColor: this.selectedBackgroundColor,
      mainTextColor: this.selectedHeaderColor
    };
    return Injector.create({
      providers: [
        { provide: 'template', useValue: template },
        { provide: 'inputValues', useValue: inputValues }
      ],
      parent: this.injector
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

    // Store selected colors in Local Storage
    localStorage.setItem('selectedBackgroundColor', this.selectedBackgroundColor);
    localStorage.setItem('selectedHeaderColor', this.selectedHeaderColor);
  }

  printCV(){
    window.print();
  }
}
