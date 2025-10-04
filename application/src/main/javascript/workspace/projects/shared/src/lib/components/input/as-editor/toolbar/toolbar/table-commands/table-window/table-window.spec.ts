import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWindow } from './table-window';

describe('TableWindow', () => {
  let component: TableWindow;
  let fixture: ComponentFixture<TableWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
