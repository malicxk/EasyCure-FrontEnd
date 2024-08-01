import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorVideoChatComponent } from './doctor-video-chat.component';

describe('DoctorVideoChatComponent', () => {
  let component: DoctorVideoChatComponent;
  let fixture: ComponentFixture<DoctorVideoChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorVideoChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorVideoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
