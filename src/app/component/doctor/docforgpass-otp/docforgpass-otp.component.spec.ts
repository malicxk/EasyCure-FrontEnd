import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocforgpassOtpComponent } from './docforgpass-otp.component';

describe('DocforgpassOtpComponent', () => {
  let component: DocforgpassOtpComponent;
  let fixture: ComponentFixture<DocforgpassOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocforgpassOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocforgpassOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
