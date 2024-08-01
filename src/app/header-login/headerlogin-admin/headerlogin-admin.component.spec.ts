import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderloginAdminComponent } from './headerlogin-admin.component';

describe('HeaderloginAdminComponent', () => {
  let component: HeaderloginAdminComponent;
  let fixture: ComponentFixture<HeaderloginAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderloginAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderloginAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
