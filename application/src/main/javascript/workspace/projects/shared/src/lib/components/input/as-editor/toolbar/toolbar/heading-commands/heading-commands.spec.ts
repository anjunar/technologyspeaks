import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingCommands } from './heading-commands';

describe('HeadingCommands', () => {
  let component: HeadingCommands;
  let fixture: ComponentFixture<HeadingCommands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingCommands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadingCommands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
