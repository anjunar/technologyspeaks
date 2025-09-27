import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuredForm } from './secured-form';

describe('SecuredForm', () => {
  let component: SecuredForm;
  let fixture: ComponentFixture<SecuredForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuredForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecuredForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
