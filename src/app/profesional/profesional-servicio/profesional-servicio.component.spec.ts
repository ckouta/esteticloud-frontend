import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalServicioComponent } from './profesional-servicio.component';

describe('ProfesionalServicioComponent', () => {
  let component: ProfesionalServicioComponent;
  let fixture: ComponentFixture<ProfesionalServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesionalServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesionalServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
