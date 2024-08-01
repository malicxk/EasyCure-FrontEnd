import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualBookedSlotsComponent } from './virtual-booked-slots.component';

describe('VirtualBookedSlotsComponent', () => {
  let component: VirtualBookedSlotsComponent;
  let fixture: ComponentFixture<VirtualBookedSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VirtualBookedSlotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VirtualBookedSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
