import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFilterBoxComponent } from './header-filter-box.component';

describe('HeaderFilterBoxComponent', () => {
  let component: HeaderFilterBoxComponent;
  let fixture: ComponentFixture<HeaderFilterBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderFilterBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderFilterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
