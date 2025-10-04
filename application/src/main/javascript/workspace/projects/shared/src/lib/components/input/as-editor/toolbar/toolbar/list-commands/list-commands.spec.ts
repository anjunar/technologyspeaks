import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCommands } from './list-commands';

describe('ListCommands', () => {
  let component: ListCommands;
  let fixture: ComponentFixture<ListCommands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCommands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCommands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
