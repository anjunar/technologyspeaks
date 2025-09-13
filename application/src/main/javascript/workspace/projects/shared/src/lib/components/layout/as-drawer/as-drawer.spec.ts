import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsDrawer } from './as-drawer';

describe('AsDrawer', () => {
  let component: AsDrawer;
  let fixture: ComponentFixture<AsDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsDrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
