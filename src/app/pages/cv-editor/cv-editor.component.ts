import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Injector,
  Type,
  ViewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CvBuilderComponent } from '../cv-builder/cv-builder.component';
import { RouterModule } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { AuthService, User } from '@auth0/auth0-angular';
import { TemplateSelectionService } from '../../../services/template-selection.service';
import { ToastService } from '../../../services/toast.service';

declare var html2pdf: any;
import jsPDF from 'jspdf';
import { Resume } from '../../../models/data.models';
import { ResumePreviewComponent } from '../../components/resume-preview/resume-preview.component';
import { PersonalInfoFormComponent } from '../forms-new/personal-info-form/personal-info-form.component';
import { ResumeDataService } from '../../../services/resume-data.service';
import { ExperienceFormComponent } from '../forms-new/experience-form/experience-form.component';
import { ColorService } from '../../../services/color.service';
import { EducationFormComponent } from '../forms-new/education-form/education-form.component';

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
    ReactiveFormsModule,
    FormsModule,
    PersonalInfoFormComponent,
    CvBuilderComponent,
    ExperienceFormComponent,
    RouterModule,
    EducationFormComponent,
    ResumePreviewComponent,
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
  selected_Template = 'modern'; // or 'classic', etc.
  selectedImageUrl: string = '';
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  isProfileDialogOpen: boolean = false;
  selectedColor!: string;
  cvData: any

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
        useCORS: true, // Enable cross-origin resource sharing
      },
      enableLinks: true,
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };

    html2pdf()
      .from(this.pdfContent.nativeElement)
      .set(options)
      .save()
      .then(() => {
        // Reset the transformation after generating the PDF
        element.style.transform = 'none';
      });
  }

  // async generatePdf(
  //   formData: Resume,
  //   selectedImageUrl?: string,
  //   customerProfilePhoto?: string
  // ){

  //   this.selectedColor = localStorage.getItem('textColor');

  //   const doc = new jsPDF();
  //   const margin = 20;
  //   let y = margin;
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const textColor = this.selectedColor;
  //   const subtextColor = '#646C86';
  //   const sectionHeaderColor = this.selectedColor;
  //   const bodyTextColor = 'black';
  //   const subText2Color = '#9FA3AE';
  //   const imageSize = 40;
  //   const leftColumnWidth = pageWidth * 0.3 - margin;
  //   const rightColumnWidth = pageWidth * 0.7 - margin * 2;
  //   const rightColumnX = margin + leftColumnWidth;

  //   // Function to load and add image
  //   async function addImage(
  //     url: string,
  //     x: number,
  //     y: number,
  //     width: number,
  //     height: number
  //   ): Promise<void> {
  //     try {
  //       const response = await fetch(url);
  //       const blob = await response.blob();
  //       const arrayBuffer = await blob.arrayBuffer();
  //       const base64String = btoa(
  //         String.fromCharCode.apply(null, [...new Uint8Array(arrayBuffer)])
  //       );
  //       doc.addImage(
  //         'data:image/png;base64,' + base64String,
  //         'PNG',
  //         x,
  //         y,
  //         width,
  //         height
  //       );
  //     } catch (error) {
  //       console.error('Error loading image:', error);
  //     }
  //   }

  //   // Header
  //   // Header
  // const profileImageUrl = selectedImageUrl || customerProfilePhoto;
  // if (profileImageUrl) {
  //   await addImage(profileImageUrl, margin, y, imageSize, imageSize);
  // }

  // doc.setFont('helvetica', 'bold');
  // doc.setFontSize(18);
  // doc.setTextColor(textColor ? textColor : 'black');
  // doc.text(
  //   `${formData.firstname} ${formData.lastname}`,
  //   margin + imageSize + 10,
  //   y + imageSize / 2 - 10
  // );

  // doc.setFont('helvetica', 'normal');
  // doc.setFontSize(12);
  // doc.setTextColor('#6F7588');
  // doc.text(formData.jobTitle, margin + imageSize + 10, y + imageSize / 2 + 5);

  // doc.setFontSize(8);
  // doc.setTextColor(subtextColor);

  // if (formData.website) {
  //   doc.textWithLink(
  //     formData.website,
  //     pageWidth - margin - doc.getTextWidth(formData.website),
  //     y,
  //     { url: `https://${formData.website}` }
  //   );
  // }
  // y += 10;

  // if (formData.linkedIn) {
  //   doc.textWithLink(
  //     'linkedin.com',
  //     pageWidth - margin - doc.getTextWidth('linkedin.com'),
  //     y,
  //     { url: `https://${formData.linkedIn}` }
  //   );
  //   y += 8;
  // }

  // if (formData.github) {
  //   doc.textWithLink(
  //     'github.com',
  //     pageWidth - margin - doc.getTextWidth('github.com'),
  //     y,
  //     { url: `https://${formData.github}` }
  //   );
  //   y += 8;
  // }

  // if (formData.email) {
  //   doc.textWithLink(
  //     formData.email,
  //     pageWidth - margin - doc.getTextWidth(formData.email),
  //     y,
  //     { url: `mailto:${formData.email}` }
  //   );
  // }
  // y += 8;
  // if (formData.phone) {
  //   doc.text(
  //     formData.phone,
  //     pageWidth - margin - doc.getTextWidth(formData.phone),
  //     y
  //   );
  // }
  // y += 15;

  // // Line
  // doc.setLineWidth(0.5);
  // doc.setDrawColor(textColor ? textColor : 'black');
  // doc.line(margin, y, pageWidth - margin, y);
  // y += 10;

  //   // Main Body
  //   doc.setFontSize(12);
  //   doc.setTextColor(sectionHeaderColor ? sectionHeaderColor : 'black');

  //   // Profile
  //   if (formData.profile) {
  //     doc.text('Profile', margin, y);
  //     y += 10;
  //     doc.setFontSize(8);
  //     doc.setTextColor(bodyTextColor);
  //     const profileLines = doc.splitTextToSize(
  //       formData.profile,
  //       pageWidth - 2 * margin
  //     );
  //     profileLines.forEach((line: any) => {
  //       doc.text(line, margin, y);
  //       y += 5;
  //     });
  //     y += 10;
  //   }

  //   // Skills
  //   if (formData.skills && formData.skills.length > 0) {
  //     doc.setFontSize(12);
  //     doc.setTextColor(sectionHeaderColor ? sectionHeaderColor : 'black');
  //     doc.text('Skills', margin, y);
  //     y += 10;
  //     doc.setFontSize(8);
  //     doc.setTextColor(bodyTextColor);
  //     let skillsX = margin + pageWidth * 0.3;
  //     let skillsY = y;
  //     let skillsCol = 0;
  //     formData.skills.forEach((skill) => {
  //       if (
  //         skillsX + doc.getTextWidth(skill.name) >
  //         margin + pageWidth - margin
  //       ) {
  //         skillsY += 5;
  //         skillsX = margin + pageWidth * 0.3;
  //         skillsCol = 0;
  //       }
  //       doc.text(skill.name, skillsX, skillsY);
  //       skillsX += doc.getTextWidth(skill.name) + 10;
  //       skillsCol++;
  //       if (skillsCol % 3 === 0) {
  //         skillsY += 5;
  //         skillsX = margin + pageWidth * 0.3;
  //         skillsCol = 0;
  //       }
  //     });
  //     y = skillsY + 10;
  //   }

  //   // Experience
  //   if (formData.experiences && formData.experiences.length > 0) {
  //     doc.setFontSize(12);
  //     doc.setTextColor(sectionHeaderColor ? sectionHeaderColor : 'black');
  //     doc.text('Experience', margin, y);
  //     y += 10;
  //     doc.setFontSize(8);
  //     doc.setTextColor(bodyTextColor);
  //     formData.experiences.forEach((experience) => {
  //       let experienceX = margin + pageWidth * 0.3;
  //       let experienceY = y;

  //       if (experience.jobTitle || experience.company) {
  //         doc.setFont('helvetica', 'bold');
  //         doc.setTextColor(textColor ? textColor : 'black');
  //         doc.text(experience.company || '', experienceX, experienceY);
  //         doc.setFont('helvetica', 'normal');
  //         doc.text(
  //           ' - ',
  //           experienceX + doc.getTextWidth(experience.company || ''),
  //           experienceY
  //         );
  //         doc.text(
  //           experience.jobTitle || '',
  //           experienceX + doc.getTextWidth(experience.company || '') + 5,
  //           experienceY
  //         );
  //         experienceY += 5;
  //         doc.setTextColor(subText2Color);
  //       }

  //       if (experience.startDate || experience.endDate || experience.type) {
  //         let dateTypeText = experience.type ? experience.type + ' - ' : '';
  //         dateTypeText +=
  //           experience.startDate && experience.endDate
  //             ? `${experience.startDate} - ${experience.endDate}`
  //             : '';
  //         doc.text(dateTypeText, experienceX, experienceY);
  //         experienceY += 5;
  //       }
  //       doc.setTextColor(subtextColor);

  //       if (experience.points && experience.points.length > 0) {
  //         doc.text('During this time, I gained;', experienceX, experienceY);
  //         experienceY += 5;
  //         experience.points.forEach((point) => {
  //           doc.text(`- ${point}`, experienceX, experienceY);
  //           experienceY += 5;
  //         });
  //       }
  //       y = experienceY + 10;
  //     });
  //   }

  //   // Education
  // if (formData.education && formData.education.length > 0) {
  //   doc.setFontSize(12);
  //   doc.setTextColor(sectionHeaderColor ? sectionHeaderColor : 'black');
  //   doc.text('Education', margin, y);
  //   y += 10;
  //   doc.setFontSize(8);
  //   doc.setTextColor(bodyTextColor);
  //   formData.education.forEach((education) => {
  //     let educationX = rightColumnX; // Use rightColumnX
  //     let educationY = y;
  //     doc.setFont('helvetica', 'bold');
  //     doc.setTextColor(textColor ? textColor : 'black');
  //     doc.text(education.institution, educationX, educationY);
  //     educationY += 5;
  //     doc.setFont('helvetica', 'normal');
  //     doc.setTextColor(bodyTextColor);
  //     doc.text(
  //       `${education.certification}, ${education.fieldOfStudy}`,
  //       educationX,
  //       educationY
  //     );
  //     educationY += 5;
  //     doc.setTextColor(subText2Color);
  //     doc.text(
  //       `${education.startDate} - ${education.endDate}`,
  //       educationX,
  //       educationY
  //     );
  //     y = educationY + 10;
  //   });
  // }

  //   doc.save(`${formData.firstname}_${formData.lastname}_resume.pdf`);
  // }

  generateResumePDF = (
    resume: Resume,
    textColor: string,
    imageData?: string
  ) => {
    // this.selectedColor = localStorage.getItem('textColor');

    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 15;
    let yPos = margin;
    const lineHeight = 5;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Set default font
    doc.setFont('helvetica', 'normal');

    // Add header section
    // Left side with image and name
    if (imageData) {
      doc.addImage(imageData, 'JPEG', margin, yPos, 10, 10, 'circle');
    }
    doc.setFontSize(16);
    doc.setTextColor(textColor);
    doc.text(
      `${resume.firstname} ${resume.lastname}`,
      margin + (imageData ? 12 : 0),
      yPos + 5
    );
    doc.setFontSize(10);
    doc.setTextColor('#6F7588');
    doc.text(
      resume.jobTitle.toUpperCase(),
      margin + (imageData ? 12 : 0),
      yPos + 9
    );

    // Right side contact info
    const contactInfo = [
      resume.website,
      resume.linkedIn ? 'linkedin.com' : '',
      resume.github ? 'github.com' : '',
      resume.email,
      resume.phone,
    ].filter(Boolean);

    contactInfo.forEach((info, index) => {
      if (info) {
        doc.setTextColor('#646C86');
        doc.text(
          info,
          pageWidth - margin - doc.getTextWidth(info),
          yPos + index * 4
        );
      }
    });

    yPos += 20;

    // Add divider line
    doc.setDrawColor(textColor);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += lineHeight;

    // Profile section
    if (resume.profile) {
      doc.setFontSize(12);
      doc.setTextColor('#6C6C6C');
      doc.text('PROFILE', margin, yPos);
      doc.setFontSize(10);
      doc.setTextColor('#000000');
      const splitProfile = doc.splitTextToSize(
        resume.profile,
        pageWidth - margin * 2 - 30
      );
      doc.text(splitProfile, margin + 30, yPos);
      yPos += splitProfile.length * lineHeight + lineHeight;
    }

    // Skills section
    if (resume.skills?.length) {
      doc.setFontSize(12);
      doc.setTextColor('#6C6C6C');
      doc.text('SKILLS', margin, yPos);

      const skills = resume.skills.map((skill) => skill.name);
      const columnWidth = (pageWidth - margin * 2 - 30) / 3;
      let currentColumn = 0;

      skills.forEach((skill, index) => {
        const x = margin + 30 + currentColumn * columnWidth;
        doc.setFontSize(10);
        doc.setTextColor('#000000');
        doc.text(skill, x, yPos + (index % 10) * lineHeight);

        if ((index + 1) % Math.ceil(skills.length / 3) === 0) {
          currentColumn++;
        }
      });

      yPos += Math.ceil(skills.length / 3) * lineHeight + lineHeight;
    }

    // Experience section
    if (resume.experiences?.length) {
      doc.setFontSize(12);
      doc.setTextColor('#6C6C6C');
      doc.text('EXPERIENCE', margin, yPos);
      yPos += lineHeight;

      resume.experiences.forEach((exp) => {
        // Company and job title
        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(exp.company, margin + 30, yPos);
        doc.text(
          exp.jobTitle,
          margin + 30 + doc.getTextWidth(exp.company) + 5,
          yPos
        );

        // Dates and type
        doc.setFontSize(8);
        doc.setTextColor('#9FA3AE');
        const dateText = `${exp.startDate} - ${exp.endDate}`;
        doc.text(`${exp.type} | ${dateText}`, margin + 30, yPos + 4);

        yPos += 8;

        // Points
        if (exp.points?.length) {
          doc.setFontSize(10);
          doc.setTextColor('#6F7588');
          exp.points.forEach((point) => {
            const bulletPoint = `• ${point}`;
            const splitPoints = doc.splitTextToSize(
              bulletPoint,
              pageWidth - margin * 2 - 35
            );
            doc.text(splitPoints, margin + 35, yPos);
            yPos += splitPoints.length * lineHeight;
          });
        }

        yPos += lineHeight;
      });
    }

    // Education section
    if (resume.education?.length) {
      doc.setFontSize(12);
      doc.setTextColor('#6C6C6C');
      doc.text('EDUCATION', margin, yPos);
      yPos += lineHeight;

      resume.education.forEach((edu) => {
        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(edu.institution, margin + 30, yPos);

        doc.setFontSize(10);
        doc.setTextColor('#4E4E4E');
        doc.text(
          `${edu.certification}, ${edu.fieldOfStudy}`,
          margin + 30,
          yPos + 4
        );

        doc.setFontSize(8);
        doc.setTextColor('#9FA3AE');
        doc.text(`${edu.startDate} - ${edu.endDate}`, margin + 30, yPos + 8);

        yPos += 12;
      });
    }

    doc.save(`${this.formData.firstname}_${this.formData.lastname}_resume.pdf`);
  };

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
    private resumeDataService: ResumeDataService,
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    public auth: AuthService,
    private templateSelectionService: TemplateSelectionService,
    @Inject(DOCUMENT) public document: Document,
    private toastService: ToastService,
    private colorService: ColorService
  ) {}

  dynamicComponentInjector() {
    return Injector.create({
      providers: [
        { provide: 'formData', useValue: this.formData },
        { provide: 'selectedImageUrl', useValue: this.selectedImageUrl },
      ],
      parent: this.injector,
    });
  }

  handleContinueClick(event: { formData: any; nextStep: number }): void {
    this.formData = event.formData;
    this.currentStepIndex = event.nextStep;
    console.log(this.formData, this.currentStepIndex);
  }


  ngOnInit() {
    this.selectedColor = this.colorService.getCurrentColor()

    this.resumeDataService.updateCVData({
      ...this.resumeDataService.getCurrentCVData(),
      textColor: this.selectedColor,
      selectedImageUrl: this.selectedImageUrl
    })

    this.resumeDataService.cvData$.subscribe(data => {
    console.log('🔄 CvEditor received data:', data); // Add this
    this.cvData = data

    console.log(this.selectedColor)
    this.cdr.markForCheck(); // Force change detection
    console.log('✅ CvEditor cvData updated:', this.cvData); // Add this
    // this.renderTemplate();
  });
    // const storedColor = localStorage.getItem('textColor');
    // if (storedColor) {
    //   this.selectedColor = storedColor;
    // } else {
    //   this.selectedColor = '#000000'; // Default color
    // }

    // console.log("Some color: ", this.selectedColor);

    // console.log(this.selectedColor);
    // this.dataService.getFormData().subscribe(async (newData) => {
    //   console.log('Received form data:', newData);
    //   this.formData = { ...this.formData, ...newData };
    //   this.cvData = this.formData;

    //   // Recompile template with new data
    //   await this.compileTemplate();

    //   const storedColor = localStorage.getItem('textColor');
    //   if (storedColor) {
    //     this.selectedColor = storedColor;
    //   } else {
    //     this.selectedColor = '#000000'; // Default color
    //   }

    //   this.cdr.markForCheck(); 
    //   console.log('Some color: ', this.selectedColor);
    // });

    // this.templateSelectionService
    //   .getSelectedTemplate()
    //   .subscribe((template) => {
    //     this.selectedTemplate = template?.templateComponent;

    //     if (template?.templateComponent) {
    //       console.log('yes');
    //       this.toastService.showToast('Template applied! 🎉', '');
    //     } else {
    //       console.log('no');
    //       this.toastService.showToast(
    //         'Template error',
    //         `An error occurred while applying this template. Please choose another.`
    //       );
    //     }
    //   });

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
    console.log(this.currentStepIndex)
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
