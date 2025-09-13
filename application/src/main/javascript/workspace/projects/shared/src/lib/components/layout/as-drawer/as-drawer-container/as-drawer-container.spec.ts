import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsDrawerContainer } from './as-drawer-container';

describe('AsDrawerContainer', () => {
  let component: AsDrawerContainer;
  let fixture: ComponentFixture<AsDrawerContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsDrawerContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsDrawerContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
