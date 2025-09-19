import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsFormArray } from './as-form-array';

describe('AsFormArray', () => {
  let component: AsFormArray;
  let fixture: ComponentFixture<AsFormArray>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsFormArray]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsFormArray);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
