import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { Router } from '@angular/router';
import { Movimiento } from 'src/app/entidades/Movimiento';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  searchText:string;
  model: NgbDateStruct;
  movimientos: Movimiento[] = [];
  formMovimiento: FormGroup;
  constructor(public restService: RestService, private router: Router, private formBuilder: FormBuilder, private parseCalendar: NgbDateParserFormatter,
    private calendar: NgbCalendar) {
    this.formMovimiento = this.formBuilder.group({
      id_movimiento: [],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
    });
    this.model = this.calendar.getToday();
  }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_ESTETI') && !this.restService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['login']);
    }
    this.restService.getProfesionalCorreo(this.restService.usuario.username).subscribe((res: any) => {
      this.restService.profesional = res;
      this.restService.getMovimientoProfesional(this.restService.profesional).subscribe((res: any[]) => {

        this.movimientos = res;
      })
    },
      err => this.movimientos = [])
  }
  movimientoEliminar(id: number) {
    this.restService.deleteMovimiento(id).subscribe((res: any[]) => {
      this.restService.getMovimientoProfesional(this.restService.profesional).subscribe((res: any[]) => {
        this.movimientos = res;
      })
    })
  }
  guardarMovimiento() {
    let movimiento: Movimiento = this.formMovimiento.value;
    this.restService.getProfesionalCorreo(this.restService.usuario.username).subscribe((res: any) => {
      movimiento.profesional = res;
      this.restService.saveMovimiento(movimiento).subscribe((res: any[]) => {
        this.restService.getMovimientoProfesional(this.restService.profesional).subscribe((res: any[]) => {
          this.movimientos = res;
        })
      })
    })

  }
  setDatosMovimiento(movimiento: Movimiento) {
    if(movimiento != null){
      this.formMovimiento.setValue({
        id_movimiento: movimiento.id_movimiento,
        nombre: movimiento.nombre,
        descripcion: movimiento.descripcion,
        valor: movimiento.valor,
        fecha: movimiento.fecha,
      })
    }
  }
  vaciar(){
    this.formMovimiento = this.formBuilder.group({
      id_movimiento: [],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
    });
  }
}
