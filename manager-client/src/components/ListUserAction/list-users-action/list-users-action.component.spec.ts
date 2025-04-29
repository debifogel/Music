import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersActionComponent } from './list-users-action.component';

describe('ListUsersActionComponent', () => {
  let component: ListUsersActionComponent;
  let fixture: ComponentFixture<ListUsersActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUsersActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUsersActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
