import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { AIService } from '../../../../services/ai.service';
import { CommonModule } from '@angular/common';
import SplitType from 'split-type';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin';
import { ChatMessage } from '../../../../models/data.models';

gsap.registerPlugin(TextPlugin);

type GeneratedContent = {
  content: string;
};

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './experience-form.component.html',
  styleUrl: './experience-form.component.scss',
})
export class ExperienceFormComponent {
  experienceForm!: FormGroup;
  @Input() formData: any;
  isAIDialogOpen: boolean = false;
  placeholder: string = '';
  instruction: string = ' (Press Tab to insert)';
  textareaValue: string = '';
  generatedContent: string = '';
  isGeneratedContentLoading: boolean = false;
  isContentGenerated: boolean = false;
  messages: ChatMessage[] = [];
  userInput: string = '';
  chatresponse: any;

  @Output() formDataChange = new EventEmitter<any>();
  @Output() continueClicked = new EventEmitter<{
    formData: any;
    nextStep: number;
  }>(); // Emit event when continue button is clicked

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private aiService: AIService
  ) {}

  setRandomPlaceholder() {
    const placeholders = [
      'Type something here...',
      'Give me a brief bio about myself as a doctor',
    ];

    if (this?.formData?.jobTitle) {
      this.placeholder = `I am a ${this.formData.jobTitle}. Give me an interesting bio in 3-4 sentences`;
    } else {
      this.placeholder =
        placeholders[Math.floor(Math.random() * placeholders.length)];
    }
  }

  onFocus(event: FocusEvent) {
    // Store the current placeholder when the textarea gains focus
    const target = event.target as HTMLTextAreaElement;
    this.placeholder = target.placeholder;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      // Set the placeholder text as the value
      this.textareaValue = this.placeholder;
    }
  }

  openAIDialog(): void {
    this.isAIDialogOpen = !this.isAIDialogOpen;
    console.log('AI open');
    this.setRandomPlaceholder();
  }

  updateFormData(newData: any): void {
    this.formData = newData;
    this.formDataChange.emit(newData);
    this.cdr.detectChanges();
  }

  onContinueClick(nextStep: number): void {
    this.updateFormData(this.formData);
    this.continueClicked.emit({ formData: this.formData, nextStep });
  }

  onPreviousClick(nextStep: number): void {
    this.updateFormData(this.formData);
    this.continueClicked.emit({ formData: this.formData, nextStep });
  }

  ngOnInit() {
    // this.initForm();

    // this.generateContent();

    this.experienceForm = this.fb.group({
      profile: [''],
      skills: this.fb.array([]),
      experiences: this.fb.array([]),
    });

    this.experienceForm.patchValue({
      profile: this.formData.profile,
    });

    // Subscribe to form value changes
    this.experienceForm.valueChanges.subscribe((value) => {
      // Emit the updated form data
      this.formDataChange.emit(value);
      this.cdr.detectChanges();
    });

    const initialSkills = this.formData.skills;
    const initialExperiences = this.formData.experiences;
    console.log(initialExperiences);
    console.log(initialSkills);

    if (initialSkills?.length >= 1) {
      this.setSkills(initialSkills);
    }

    if (initialExperiences?.length >= 1) {
      this.setExperiences(initialExperiences);
    }
  }

  handleFormChange(formData: any): void {
    this.formDataChange.emit(formData);
    this.cdr.detectChanges();
    // this.dataService.updateFormData(formData);
  }

  generateContent() {
    this.isContentGenerated = true;

    // if(this.generatedContent.length > 0){
    //   this.generatedContent
    // }

    // const prompt = `I am a ${this.formData.jobTitle}. Give me an interesting bio in 3-4 sentences`;
    const prompt = this.textareaValue;

    this.aiService.generateContent(prompt).subscribe(
      (generatedContent: GeneratedContent) => {
        console.log('Generated Content:', generatedContent.content);
        this.generatedContent = generatedContent.content;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  sendMessage() {
    if (!this.textareaValue.trim()) return;

    this.messages.push({ content: this.textareaValue, sender: 'user' });
    const userMessage = this.textareaValue;
    this.textareaValue = '';

    this.isGeneratedContentLoading = true; // Set loading state to true

    this.aiService.generateContent(userMessage).subscribe(
      (response: GeneratedContent) => {
        console.log('Generated Content:', response.content);
        this.messages.push({ content: response.content, sender: 'bot' });
        this.isGeneratedContentLoading = false; // Set loading state to false
        console.log(this.isGeneratedContentLoading);
        this.scrollToBottom();
        this.cdr.detectChanges(); // Ensure change detection is triggered

        // this.chatresponse = response.content;

        // const botMessage: ChatMessage = { content: response.content, sender: 'bot', animate: false };
        // this.messages.push(botMessage);

         // Delay to allow the DOM to update before applying GSAP
        //  setTimeout(() => {
        //   const chatBoxElements = document.querySelectorAll('.chat-box.animate');
        //   const lastChatBox = chatBoxElements[chatBoxElements.length - 1];
        //   if (lastChatBox) {
        //     const speed = 0.1; // Typing speed (lower value for faster typing)
        //     gsap.fromTo(lastChatBox, 
        //       { opacity: 0, y: 30 }, 
        //       {
        //         opacity: 1,
        //         y: 0,
        //         text: response.content,
        //         duration: 1,
        //         ease: 'power4',
        //         onComplete: () => {
        //           // Remove the animate class after animation
        //           lastChatBox.classList.remove('animate');
        //         }
        //       });
        //   }
        // }, 0); // Adjust delay if necessary

        // if (response.content) {    
        //   const speed = 0.1; // Typing speed (lower value for faster typing)

        //   gsap.to('.chat-box', {
        //     delay: 2,
        //     text: this.chatresponse,
        //     duration: this.chatresponse.length * speed,
        //     ease: 'power1.in',
        //   });
        // }
      },
      (error) => {
        console.error('Error:', error);
        this.isGeneratedContentLoading = false; // Ensure loading state is reset on error
      }
    );
  }

  scrollToBottom() {
    const chatHistory = document.getElementById('chatHistory');
    if (chatHistory) {
      setTimeout(() => {
        chatHistory.scrollTop = chatHistory.scrollHeight;
      }, 100); // Add a slight delay to ensure it scrolls after the new message is rendered
    }
  }

  setSkills(skills: string[]) {
    const skillFormArray = this.experienceForm.get('skills') as FormArray;
    if (skills) {
      skills.forEach((skill) => {
        skillFormArray.push(this.fb.control(skill));
      });
    }
  }

  setExperiences(experiences: any[]) {
    const experienceFormArray = this.experienceForm.get(
      'experiences'
    ) as FormArray;
    if (experiences) {
      experiences.forEach((exp) => {
        experienceFormArray.push(
          this.fb.group({
            jobTitle: [exp.jobTitle],
            company: [exp.company],
            location: [exp.location],
            type: [exp.type],
            startDate: [exp.startDate],
            endDate: [exp.endDate],
            points: this.fb.array([]), // You might need to initialize this array as well if needed
          })
        );
      });
    }
  }

  get skills(): FormArray {
    return this.experienceForm.get('skills') as FormArray;
  }

  get experienceSectionFormArray(): any[] {
    return (this.experienceForm.get('experiences') as FormArray).controls;
  }

  getRandomColor(): {
    mainColor: string;
    lighterColor: string;
    filter: string;
  } {
    // Array of predefined colors and their lighter shades
    const colors = [
      {
        mainColor: '#B42318',
        lighterColor: '#FEE4E2',
        filter:
          'invert(70%) sepia(71%) saturate(3896%) hue-rotate(348deg) brightness(70%) contrast(101%)',
      }, // Example colors, you can add more
      {
        mainColor: '#1172CC',
        lighterColor: '#EDF6FF',
        filter:
          'invert(66%) sepia(85%) saturate(1393%) hue-rotate(189deg) brightness(97%) contrast(70%)',
      },
      {
        mainColor: '#FD6C9E',
        lighterColor: '#FBDFE8',
        filter:
          'invert(35%) sepia(7%) saturate(5902%) hue-rotate(300deg) brightness(102%) contrast(98%)',
      },
      {
        mainColor: '#98A2B3',
        lighterColor: '#F0F0F0',
        filter:
          'invert(30%) sepia(6%) saturate(736%) hue-rotate(179deg) brightness(88%) contrast(87%)',
      },
      {
        mainColor: '#9B8AFB',
        lighterColor: '#F0EDFF',
        filter:
          'invert(36%) sepia(17%) saturate(7014%) hue-rotate(213deg) brightness(103%) contrast(97%)',
      },
      {
        mainColor: '#32D583',
        lighterColor: '#DEF4E9',
        filter:
          'invert(30%) sepia(39%) saturate(814%) hue-rotate(95deg) brightness(97%) contrast(80%)',
      },
      {
        mainColor: '#FDB022',
        lighterColor: '#FFF2DA',
        filter:
          'invert(20%) sepia(19%) saturate(5028%) hue-rotate(340deg) brightness(101%) contrast(98%)',
      },
      {
        mainColor: '#B57EDC',
        lighterColor: '#EDDEF9',
        filter:
          'invert(43%) sepia(70%) saturate(867%) hue-rotate(219deg) brightness(91%) contrast(89%)',
      },

      // Add more colors here as needed
    ];

    // console.log(colors[0].filter)

    // Randomly select a color from the array
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;

  addSkill(skill: string, event: Event): void {
    if (skill.trim()) {
      // const randomColor = this.getRandomColor();

      const { mainColor, lighterColor, filter } = this.getRandomColor();
      this.skills.push(
        this.fb.group({
          name: skill.trim(),
          color: mainColor,
          backgroundColor: lighterColor,
          filter: filter,
        })
      );
    }

    this.skillInput.nativeElement.value = '';

    event.stopPropagation();
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  addExperience(): void {
    const experiences = this.experienceForm.get('experiences') as FormArray;
    experiences.push(this.createExperience());
  }

  addPoint(experienceIndex: number): void {
    const experience = (this.experienceForm.get('experiences') as FormArray).at(
      experienceIndex
    );
    const points = experience.get('points') as FormArray;
    points.push(this.fb.control(''));
  }

  removeExperience(index: number): void {
    const experiences = this.experienceForm.get('experiences') as FormArray;
    experiences.removeAt(index);
  }

  removePoint(experienceIndex: number, pointIndex: number): void {
    const experience = (this.experienceForm.get('experiences') as FormArray).at(
      experienceIndex
    );
    const points = experience.get('points') as FormArray;
    points.removeAt(pointIndex);
  }

  createExperience(): FormGroup {
    return this.fb.group({
      jobTitle: [''],
      company: [''],
      location: [''],
      type: [''],
      startDate: [''],
      endDate: [''],
      points: this.fb.array([]),
    });
  }
}
