import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgPassOtpComponent } from './forg-pass-otp.component';

describe('ForgPassOtpComponent', () => {
  let component: ForgPassOtpComponent;
  let fixture: ComponentFixture<ForgPassOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgPassOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForgPassOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
