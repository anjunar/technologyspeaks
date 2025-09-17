import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsViewPort } from './as-view-port';

describe('AsViewPort', () => {
  let component: AsViewPort;
  let fixture: ComponentFixture<AsViewPort>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsViewPort]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsViewPort);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
