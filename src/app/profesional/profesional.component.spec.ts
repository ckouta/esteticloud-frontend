import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalComponent } from './profesional.component';

describe('ProfesionalComponent', () => {
  let component: ProfesionalComponent;
  let fixture: ComponentFixture<ProfesionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
