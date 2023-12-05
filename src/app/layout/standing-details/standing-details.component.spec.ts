import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingDetailsComponent } from './standing-details.component';

describe('StandingDetailsComponent', () => {
  let component: StandingDetailsComponent;
  let fixture: ComponentFixture<StandingDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandingDetailsComponent]
    });
    fixture = TestBed.createComponent(StandingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});