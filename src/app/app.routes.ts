import { Routes } from '@angular/router';
import { CvBuilderComponent } from './pages/cv-builder/cv-builder.component';
import { CvEditorComponent } from './pages/cv-editor/cv-editor.component';
import { PersonalInfoFormComponent } from './pages/forms/personal-info-form/personal-info-form.component';
import { ExperienceFormComponent } from './pages/forms/experience-form/experience-form.component';

export const routes: Routes = [
    {path: '', redirectTo: 'cv-builder/editor', pathMatch: 'full'},
    // {path: 'cv-builder', component: CvBuilderComponent},
    {path: 'cv-builder/editor', component:  CvEditorComponent, children: [
        {path: 'personal', component: PersonalInfoFormComponent},
        {path: 'experience', component: ExperienceFormComponent}
    ]}

];
