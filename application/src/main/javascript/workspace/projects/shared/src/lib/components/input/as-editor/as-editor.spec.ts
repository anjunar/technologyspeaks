import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsEditor } from './as-editor';

describe('AsEditor', () => {
  let component: AsEditor;
  let fixture: ComponentFixture<AsEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
