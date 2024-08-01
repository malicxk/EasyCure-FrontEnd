import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtyDoctorsComponent } from './specialty-doctors.component';

describe('SpecialtyDoctorsComponent', () => {
  let component: SpecialtyDoctorsComponent;
  let fixture: ComponentFixture<SpecialtyDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialtyDoctorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialtyDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
