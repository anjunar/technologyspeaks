import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsImageProcess } from './as-image-process';

describe('AsImageProcess', () => {
  let component: AsImageProcess;
  let fixture: ComponentFixture<AsImageProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsImageProcess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsImageProcess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
