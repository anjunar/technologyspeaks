import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsDrawerContent } from './as-drawer-content';

describe('AsDrawerContent', () => {
  let component: AsDrawerContent;
  let fixture: ComponentFixture<AsDrawerContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsDrawerContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsDrawerContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
