import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorViewprofileComponent } from './doctor-viewprofile.component';

describe('DoctorViewprofileComponent', () => {
  let component: DoctorViewprofileComponent;
  let fixture: ComponentFixture<DoctorViewprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorViewprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorViewprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
