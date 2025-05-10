import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PlantService } from './plant.service';

describe('PlantService', () => {
  let service: PlantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        PlantService
      ]
    });
    service = TestBed.inject(PlantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPlants() returns whatever http.get provides', (done) => {
    service['http'] = {
      get: () => ({
        pipe: () => ({
          subscribe: (next: any) => next([{ id: 42, name: 'MyPlant' }])
        })
      })
    } as any;

    service.getPlants().subscribe(plants => {
      expect(plants.length).toBe(1);
      expect(plants[0].name).toBe('MyPlant');
      done();
    });
  });

  it('savePlant() returns whatever http.post provides', (done) => {
    const newPlant = { nickname: 'New' };
    service['http'] = {
      post: (_url: string, body: any) => ({
        pipe: () => ({
          subscribe: (next: any) => next({ ok: true, sent: body })
        })
      })
    } as any;

    service.savePlant(newPlant).subscribe(resp => {
      expect(resp.ok).toBeTrue();
      expect(resp.sent.nickname).toBe('New');
      done();
    });
  });
});
