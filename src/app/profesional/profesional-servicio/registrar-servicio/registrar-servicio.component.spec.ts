import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarServicioComponent } from './registrar-servicio.component';

describe('RegistrarServicioComponent', () => {
  let component: RegistrarServicioComponent;
  let fixture: ComponentFixture<RegistrarServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
