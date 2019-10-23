import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarProfesionalesComponent } from './registrar-profesionales.component';

describe('RegistrarProfesionalesComponent', () => {
  let component: RegistrarProfesionalesComponent;
  let fixture: ComponentFixture<RegistrarProfesionalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarProfesionalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
