import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantDashboardComponent } from './plant-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlantService } from '../../Services/plant.service';

describe('PlantDashboardComponent', () => {
  let component: PlantDashboardComponent;
  let fixture: ComponentFixture<PlantDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantDashboardComponent, HttpClientTestingModule],
      providers: [PlantService],
    }).compileComponents();

    fixture = TestBed.createComponent(PlantDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
