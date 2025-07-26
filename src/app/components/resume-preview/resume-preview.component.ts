import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import * as Handlebars from 'handlebars';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-preview.component.html',
  styleUrl: './resume-preview.component.scss',
})
export class ResumePreviewComponent implements OnChanges {
  @Input() templateName: string = 'modern';
  @Input() cvData: any;
  @Input() textColor: any;

  constructor(private sanitizer: DomSanitizer, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  htmlOutput: SafeHtml = '';

  private compiledTemplate: Handlebars.TemplateDelegate | null = null;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    // If the template name changes, or if we don't have a compiled template yet, load it.
    if (changes['templateName'] || !this.compiledTemplate) {
      await this.loadAndCompileTemplate();
    }

    // If we have data and a compiled template, render the HTML.
    if (this.cvData && this.compiledTemplate) {
      this.renderTemplate();
    }
  }

  private async loadAndCompileTemplate(): Promise<void> {
    if (!this.templateName) return;
    try {
      const templatePath = `assets/templates-two/${this.templateName}.hbs`;
      const response = await fetch(templatePath);
      const rawTemplate = await response.text();
      this.compiledTemplate = Handlebars.compile(rawTemplate);
    } catch (error) {
      console.error('Error loading or compiling template:', error);
      this.compiledTemplate = null;
    }
  }

  private renderTemplate(): void {
    if (!this.compiledTemplate || !this.cvData) return;

    // This is the key: We run the update inside the zone.
    this.zone.run(() => {
      const output = this.compiledTemplate!(this.cvData, this.textColor);
      this.htmlOutput = this.sanitizer.bypassSecurityTrustHtml(output);
      
      // And we explicitly tell this component to update its view immediately.
      this.cdr.detectChanges();
    });
  }

  // async ngOnChanges(changes: SimpleChanges): Promise<void> {
  //   if (this.cvData && this.templateName) {
  //     const templatePath = `assets/templates-two/${this.templateName}.hbs`;
  //     const response = await fetch(templatePath);
  //     const rawTemplate = await response.text();
  //     // console.log(rawTemplate)

  //     const compiled = Handlebars.compile(rawTemplate);
  //     this.htmlOutput = this.sanitizer.bypassSecurityTrustHtml(compiled(this.cvData));    }
  // }
}
