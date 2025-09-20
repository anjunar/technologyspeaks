import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsArrayForm } from './as-array-form';

describe('AsArrayForm', () => {
  let component: AsArrayForm;
  let fixture: ComponentFixture<AsArrayForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsArrayForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsArrayForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
