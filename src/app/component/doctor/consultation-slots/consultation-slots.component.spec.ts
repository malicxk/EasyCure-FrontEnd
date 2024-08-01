import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationSlotsComponent } from './consultation-slots.component';

describe('ConsultationSlotsComponent', () => {
  let component: ConsultationSlotsComponent;
  let fixture: ComponentFixture<ConsultationSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultationSlotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultationSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
