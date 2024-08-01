import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderloginDoctorComponent } from './headerlogin-doctor.component';

describe('HeaderloginDoctorComponent', () => {
  let component: HeaderloginDoctorComponent;
  let fixture: ComponentFixture<HeaderloginDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderloginDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderloginDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
