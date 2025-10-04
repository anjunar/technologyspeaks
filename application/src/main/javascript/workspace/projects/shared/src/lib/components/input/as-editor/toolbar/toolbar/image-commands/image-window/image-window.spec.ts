import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWindow } from './image-window';

describe('ImageWindow', () => {
  let component: ImageWindow;
  let fixture: ComponentFixture<ImageWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
