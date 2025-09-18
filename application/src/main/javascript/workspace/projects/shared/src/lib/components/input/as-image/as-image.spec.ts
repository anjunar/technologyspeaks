import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsImage } from './as-image';

describe('AsImage', () => {
  let component: AsImage;
  let fixture: ComponentFixture<AsImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
