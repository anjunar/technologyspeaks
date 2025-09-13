import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsToolbar } from './as-toolbar';

describe('AsToolbar', () => {
  let component: AsToolbar;
  let fixture: ComponentFixture<AsToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
