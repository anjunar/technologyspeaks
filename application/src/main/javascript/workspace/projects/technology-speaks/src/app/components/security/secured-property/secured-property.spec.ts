import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuredProperty } from './secured-property';

describe('SecuredProperty', () => {
  let component: SecuredProperty;
  let fixture: ComponentFixture<SecuredProperty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuredProperty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecuredProperty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
