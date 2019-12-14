import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteReservaComponent } from './cliente-reserva.component';

describe('ClienteReservaComponent', () => {
  let component: ClienteReservaComponent;
  let fixture: ComponentFixture<ClienteReservaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteReservaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
