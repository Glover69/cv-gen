import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateOnePreviewComponent } from './template-one-preview.component';

describe('TemplateOnePreviewComponent', () => {
  let component: TemplateOnePreviewComponent;
  let fixture: ComponentFixture<TemplateOnePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateOnePreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateOnePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
