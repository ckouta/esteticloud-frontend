import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { Router } from '@angular/router';
import { Movimiento } from 'src/app/entidades/Movimiento';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbCalendar, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { number } from '@amcharts/amcharts4/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  searchText:string;
  model: NgbDateStruct;
  movimientos: Movimiento[] = [];
  templateChecked = true;
  valor = true;
  checkvalor:boolean = true;
  formMovimiento: FormGroup;
  formMovimiento2: FormGroup;
  show:boolean=false;
  MaxFecha:string;
  MinFecha:string;
  date:Date;
  constructor(public restService: RestService, private router: Router, private formBuilder: FormBuilder, private parseCalendar: NgbDateParserFormatter,
    private calendar: NgbCalendar, private datePipe: DatePipe) {
      this.formMovimiento = this.formBuilder.group({
        id_movimiento: [],
        nombre: [{value: '', disabled: this.show}, [Validators.required, Validators.minLength(3)]],
        descripcion: [{value: '', disabled: this.show}, [Validators.required, Validators.minLength(3),Validators.maxLength(250)]],
        radio:new FormControl(true),
        valor: [{value: '', disabled: this.show}, [Validators.required]],
        fecha: [{value: '', disabled: this.show}, [Validators.required]],
      });
      this.formMovimiento2 = this.formBuilder.group({
        id_movimiento: [],
        nombre: [{value: '', disabled: true}, [Validators.required]],
        descripcion: [{value: '', disabled: true}, [Validators.required]],
        radio:new FormControl(true),
        valor: [{value: '', disabled: true}, [Validators.required]],
        fecha: [{value: '', disabled: true}, [Validators.required]],
      });
    this.model = this.calendar.getToday();
    this.MaxFecha = this.parseCalendar.format(this.calendar.getToday());
    this.MinFecha = this.parseCalendar.format(this.model);
    this.date = new Date();
    this.MinFecha=this.datePipe.transform(new Date(new Date().setDate(this.date.getDate() - 7)), 'yyyy-MM-dd');
  }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_ESTETI') && !this.restService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['login']);
    }
    this.restService.getProfesionalCorreo(this.restService.usuario.username).subscribe((res: any) => {
      this.restService.profesional = res;
      this.restService.getMovimientoProfesional(this.restService.profesional).subscribe((res: any[]) => {

        this.movimientos = res;
        console.log(this.movimientos);
      })
    },
      err => this.movimientos = [])
  }
  test(){
  
    if(this.formMovimiento.value['fecha']>this.MaxFecha || this.formMovimiento.value['fecha']<this.MinFecha){
       console.log(true);
    }else{
      console.log(false);
    }
  }
  getCheckboxesValue() {
    console.log('ngModel value', this.valor);
  }
  movimientoEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro que desea eliminar el movimiento?',
      text: "El cambio es irreversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'  
    }).then((result) => {
      if (result.value) {
        this.restService.deleteMovimiento(id).subscribe((res: any[]) => {
          this.restService.getMovimientoProfesional(this.restService.profesional).subscribe((res: any[]) => {
            Swal.fire('Solicitud aceptada', 'El movimiento ha sido eliminado', 'success');
            this.movimientos = res;
          },err =>{
            Swal.fire('Solicitud rechazada', 'El movimiento no se pudo eliminar', 'error');
          })
        })
      }
    })
    
  }
  guardarMovimiento() {
    let movimiento: Movimiento = this.formMovimiento.value;
    if(!this.formMovimiento.get('radio').value){
      let valor = +movimiento.valor*-1;
      movimiento.valor= ''+valor;
    }
    this.restService.getProfesionalCorreo(this.restService.usuario.username).subscribe((res: any) => {
      movimiento.profesional = res;
      this.restService.saveMovimiento(movimiento).subscribe((res: any[]) => {
        Swal.fire('Solicitud aceptada', 'El movimiento ha sido registrado', 'success');
        this.restService.getMovimientoProfesional(this.restService.profesional).subscribe((res: any[]) => {
          this.movimientos = res;
        })
      },err =>{
        Swal.fire('Solicitud rechazada', 'El movimiento no se pudo registrar', 'error');
      })
    })

  }
  setDatosMovimiento(movimiento: Movimiento) {
    let radio = true;
    let valor = +movimiento.valor;

  if (valor<0) {
    radio = false;
    valor= valor*-1;
  }
    if(movimiento != null){
      
      this.formMovimiento.setValue({
        id_movimiento: movimiento.id_movimiento,
        nombre: movimiento.nombre,
        descripcion: movimiento.descripcion,
        radio:radio,
        valor: valor,
        fecha: movimiento.fecha,
      })
    }
  }
  vaciar(){
    this.formMovimiento = this.formBuilder.group({
      id_movimiento: [],
      nombre: [{value: '', disabled: this.show}, [Validators.required, Validators.minLength(3)]],
      descripcion: [{value: '', disabled: this.show}, [Validators.required, Validators.minLength(3),Validators.maxLength(250)]],
      radio:new FormControl(true),
      valor: [{value: '', disabled: this.show}, [Validators.required]],
      fecha: [{value: '', disabled: this.show}, [Validators.required]],
    });
  }
  mostrar(movimiento: Movimiento) {
      let radio = true;
      let valor = +movimiento.valor;
    if (valor<0) {
      radio = false;
      valor= valor*-1;
    }
    if(movimiento != null){
      this.formMovimiento2.setValue({
        id_movimiento: movimiento.id_movimiento,
        nombre: movimiento.nombre,
        descripcion: movimiento.descripcion,
        radio: radio,
        valor: valor,
        fecha: movimiento.fecha,
      })
    }
  }
}
