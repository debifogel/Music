import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafimComponent } from './grafim.component';

describe('GrafimComponent', () => {
  let component: GrafimComponent;
  let fixture: ComponentFixture<GrafimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
