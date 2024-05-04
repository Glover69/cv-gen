import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvEditorComponent } from './cv-editor.component';

describe('CvEditorComponent', () => {
  let component: CvEditorComponent;
  let fixture: ComponentFixture<CvEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CvEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
