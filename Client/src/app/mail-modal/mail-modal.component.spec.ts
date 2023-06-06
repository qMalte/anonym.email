import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailModalComponent } from './mail-modal.component';

describe('HelpModalComponent', () => {
  let component: MailModalComponent;
  let fixture: ComponentFixture<MailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
