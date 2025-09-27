import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsLazySelect } from './as-lazy-select';

describe('AsLazySelect', () => {
  let component: AsLazySelect;
  let fixture: ComponentFixture<AsLazySelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsLazySelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsLazySelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
