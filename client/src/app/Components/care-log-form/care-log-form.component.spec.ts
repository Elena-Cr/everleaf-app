import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareLogFormComponent } from './care-log-form.component';

describe('CareLogFormComponent', () => {
  let component: CareLogFormComponent;
  let fixture: ComponentFixture<CareLogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareLogFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CareLogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
