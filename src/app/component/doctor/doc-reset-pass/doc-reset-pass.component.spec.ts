import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocResetPassComponent } from './doc-reset-pass.component';

describe('DocResetPassComponent', () => {
  let component: DocResetPassComponent;
  let fixture: ComponentFixture<DocResetPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocResetPassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocResetPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
