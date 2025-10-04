import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCommands } from './link-commands';

describe('LinkCommands', () => {
  let component: LinkCommands;
  let fixture: ComponentFixture<LinkCommands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkCommands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkCommands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
