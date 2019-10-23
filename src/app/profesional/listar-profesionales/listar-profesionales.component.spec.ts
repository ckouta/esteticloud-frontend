import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProfesionalesComponent } from './listar-profesionales.component';

describe('ListarProfesionalesComponent', () => {
  let component: ListarProfesionalesComponent;
  let fixture: ComponentFixture<ListarProfesionalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarProfesionalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
