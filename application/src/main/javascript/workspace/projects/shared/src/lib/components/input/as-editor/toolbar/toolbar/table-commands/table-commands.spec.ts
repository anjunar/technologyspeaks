import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCommands } from './table-commands';

describe('TableCommands', () => {
  let component: TableCommands;
  let fixture: ComponentFixture<TableCommands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCommands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCommands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
