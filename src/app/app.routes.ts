import { Routes } from '@angular/router';
import { CvBuilderComponent } from './pages/cv-builder/cv-builder.component';

export const routes: Routes = [
    {path: '', redirectTo: 'cv-builder', pathMatch: 'full'},
    {path: 'cv-builder', component: CvBuilderComponent}
];
