import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaHorarioComponent } from './lista-horario.component';

describe('ListaHorarioComponent', () => {
  let component: ListaHorarioComponent;
  let fixture: ComponentFixture<ListaHorarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaHorarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
