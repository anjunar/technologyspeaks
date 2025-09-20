import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsMenu } from './as-menu';

describe('AsMenu', () => {
  let component: AsMenu;
  let fixture: ComponentFixture<AsMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
