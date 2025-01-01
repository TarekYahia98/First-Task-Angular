import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendUserDetailsComponent } from './backend-user-details.component';

describe('BackendUserDetailsComponent', () => {
  let component: BackendUserDetailsComponent;
  let fixture: ComponentFixture<BackendUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackendUserDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BackendUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
