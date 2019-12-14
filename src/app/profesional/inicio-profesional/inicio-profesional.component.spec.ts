import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioProfesionalComponent } from './inicio-profesional.component';

describe('InicioProfesionalComponent', () => {
  let component: InicioProfesionalComponent;
  let fixture: ComponentFixture<InicioProfesionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioProfesionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
