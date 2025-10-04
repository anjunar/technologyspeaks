import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCommands } from './base-commands';

describe('BaseCommands', () => {
  let component: BaseCommands;
  let fixture: ComponentFixture<BaseCommands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseCommands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseCommands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
