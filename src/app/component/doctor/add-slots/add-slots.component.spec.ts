import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlotsComponent } from './add-slots.component';

describe('AddSlotsComponent', () => {
  let component: AddSlotsComponent;
  let fixture: ComponentFixture<AddSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSlotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
