import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarClientesComponent } from './registrar-clientes.component';

describe('RegistrarClientesComponent', () => {
  let component: RegistrarClientesComponent;
  let fixture: ComponentFixture<RegistrarClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
