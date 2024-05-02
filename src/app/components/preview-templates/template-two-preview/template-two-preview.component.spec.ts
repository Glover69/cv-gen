import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTwoPreviewComponent } from './template-two-preview.component';

describe('TemplateTwoPreviewComponent', () => {
  let component: TemplateTwoPreviewComponent;
  let fixture: ComponentFixture<TemplateTwoPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateTwoPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateTwoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
