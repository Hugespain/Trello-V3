import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtaskDialogComponent } from './newtask-dialog.component';

describe('NewtaskDialogComponent', () => {
  let component: NewtaskDialogComponent;
  let fixture: ComponentFixture<NewtaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewtaskDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewtaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
