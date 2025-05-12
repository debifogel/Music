import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerDialogComponent } from './date-picker-dialog.component';

describe('DatePickerDialogComponent', () => {
  let component: DatePickerDialogComponent;
  let fixture: ComponentFixture<DatePickerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
