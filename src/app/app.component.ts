import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CvBuilderComponent } from './pages/cv-builder/cv-builder.component';
import { CvEditorComponent } from './pages/cv-editor/cv-editor.component';
import { DataService } from '../services/data.service';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from '../services/toast.service';

type Toast = {
  header: string;
  message?: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, CvBuilderComponent, CvEditorComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cv-gen';
  toastMessage: string = '';
  toastHeader: string = '';

  constructor(private toastService: ToastService, private el: ElementRef) {}


  ngOnInit() {
    this.toastService.toast$.subscribe((toast: Toast) => {
      this.toastMessage = `${toast.message}`;
      this.toastHeader = `${toast.header}`;
      // Automatically hide the snackbar after 5 seconds
      setTimeout(
        () => {
          // this.animateOut();
          ((this.toastHeader = '', this.toastMessage = ''))
          // ((this.toastHeader = ''))

        },
        3500
      );

    });
  }
}
