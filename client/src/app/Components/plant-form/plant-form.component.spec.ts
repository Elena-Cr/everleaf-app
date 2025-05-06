import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';

import { PlantFormComponent } from './plant-form.component';
import { PlantService } from '../../Services/plant.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//Jasmine: The test cases are written using Jasmine syntax (e.g., describe, it, expect).

describe('PlantFormComponent', () => {
  let component: PlantFormComponent;
  let fixture: ComponentFixture<PlantFormComponent>;
  let plantServiceSpy: jasmine.SpyObj<PlantService>;

  beforeEach(async () => {
    const plantServiceMock = jasmine.createSpyObj('PlantService', ['savePlant', 'updatePlant', 'getPlantTypes'], { currentUserId: 1 });

    plantServiceMock.getPlantTypes.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        PlantFormComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: PlantService, useValue: plantServiceMock },
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlantFormComponent);
    component = fixture.componentInstance;
    plantServiceSpy = TestBed.inject(PlantService) as jasmine.SpyObj<PlantService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Verifies that the component is created successfully.
    expect(component).toBeTruthy();
  });

  it('should create the form', () => {
    // Ensures the form is initialized with the correct controls.
    expect(component.plantForm).toBeDefined();
    expect(component.plantForm.controls['name']).toBeDefined();
    expect(component.plantForm.controls['plantType']).toBeDefined();
    expect(component.plantForm.controls['plantedDate']).toBeDefined();
  });

  it('should invalidate the form when required fields are missing', () => {
    // Validates that the form is invalid when required fields are empty.
    component.plantForm.controls['name'].setValue('');
    component.plantForm.controls['plantType'].setValue('');
    component.plantForm.controls['plantedDate'].setValue('');

    expect(component.plantForm.valid).toBeFalse();
  });

  it('should call plantService.savePlant when form is valid', () => {
    // Confirms that the savePlant method is called with the correct data when the form is valid and submitted.
    const mockPlantData = {
      name: 'Fern',
      plantType: { id: 1, commonName: 'Fern' },
      plantedDate: new Date(),
    };

    component.plantForm.controls['name'].setValue(mockPlantData.name);
    component.plantForm.controls['plantType'].setValue(mockPlantData.plantType);
    component.plantForm.controls['plantedDate'].setValue(mockPlantData.plantedDate);

    plantServiceSpy.savePlant.and.returnValue(of({}));

    component.onSubmit();

    expect(plantServiceSpy.savePlant).toHaveBeenCalled();
    expect(plantServiceSpy.savePlant).toHaveBeenCalledWith(jasmine.objectContaining({
      Nickname: mockPlantData.name,
      Species: mockPlantData.plantType.id,
    }));
  });
});
