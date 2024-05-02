import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateThreePreviewComponent } from './template-three-preview.component';

describe('TemplateThreePreviewComponent', () => {
  let component: TemplateThreePreviewComponent;
  let fixture: ComponentFixture<TemplateThreePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateThreePreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateThreePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
