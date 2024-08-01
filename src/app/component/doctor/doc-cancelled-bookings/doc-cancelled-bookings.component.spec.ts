import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocCancelledBookingsComponent } from './doc-cancelled-bookings.component';

describe('DocCancelledBookingsComponent', () => {
  let component: DocCancelledBookingsComponent;
  let fixture: ComponentFixture<DocCancelledBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocCancelledBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocCancelledBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
