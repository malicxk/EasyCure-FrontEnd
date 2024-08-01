import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocOTPComponent } from './doc-otp.component';

describe('DocOTPComponent', () => {
  let component: DocOTPComponent;
  let fixture: ComponentFixture<DocOTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocOTPComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
