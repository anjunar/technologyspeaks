import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsInputContainer } from './as-input-container';

describe('AsInputContainer', () => {
  let component: AsInputContainer;
  let fixture: ComponentFixture<AsInputContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsInputContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsInputContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
