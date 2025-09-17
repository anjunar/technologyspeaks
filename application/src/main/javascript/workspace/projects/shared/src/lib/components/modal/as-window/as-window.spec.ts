import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsWindow } from './as-window';

describe('AsWindow', () => {
  let component: AsWindow;
  let fixture: ComponentFixture<AsWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
