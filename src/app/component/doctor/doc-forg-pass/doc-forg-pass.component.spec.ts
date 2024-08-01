import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocForgPassComponent } from './doc-forg-pass.component';

describe('DocForgPassComponent', () => {
  let component: DocForgPassComponent;
  let fixture: ComponentFixture<DocForgPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocForgPassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocForgPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
