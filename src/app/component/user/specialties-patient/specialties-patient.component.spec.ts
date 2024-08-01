import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtiesPatientComponent } from './specialties-patient.component';

describe('SpecialtiesPatientComponent', () => {
  let component: SpecialtiesPatientComponent;
  let fixture: ComponentFixture<SpecialtiesPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialtiesPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialtiesPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
