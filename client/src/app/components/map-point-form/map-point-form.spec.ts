import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPointForm } from './map-point-form';

describe('MapPointForm', () => {
  let component: MapPointForm;
  let fixture: ComponentFixture<MapPointForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPointForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPointForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
