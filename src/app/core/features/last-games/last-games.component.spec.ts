import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastGamesComponent } from './last-games.component';

describe('LastGamesComponent', () => {
  let component: LastGamesComponent;
  let fixture: ComponentFixture<LastGamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastGamesComponent]
    });
    fixture = TestBed.createComponent(LastGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
