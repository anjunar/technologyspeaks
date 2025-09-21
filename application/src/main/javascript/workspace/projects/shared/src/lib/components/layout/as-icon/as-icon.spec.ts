import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsIcon } from './as-icon';

describe('AsIcon', () => {
  let component: AsIcon;
  let fixture: ComponentFixture<AsIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
