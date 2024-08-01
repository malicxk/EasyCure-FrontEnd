import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVideoChatComponent } from './patient-video-chat.component';

describe('PatientVideoChatComponent', () => {
  let component: PatientVideoChatComponent;
  let fixture: ComponentFixture<PatientVideoChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientVideoChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientVideoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
