import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCommands } from './image-commands';

describe('ImageCommands', () => {
  let component: ImageCommands;
  let fixture: ComponentFixture<ImageCommands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCommands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCommands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
