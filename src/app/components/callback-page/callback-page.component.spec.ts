import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackPageComponent } from './callback-page.component';

describe('CallbackPageComponent', () => {
  let component: CallbackPageComponent;
  let fixture: ComponentFixture<CallbackPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallbackPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallbackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
