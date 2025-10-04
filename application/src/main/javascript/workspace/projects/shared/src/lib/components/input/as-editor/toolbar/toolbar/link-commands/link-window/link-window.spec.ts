import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkWindow } from './link-window';

describe('LinkWindow', () => {
  let component: LinkWindow;
  let fixture: ComponentFixture<LinkWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
