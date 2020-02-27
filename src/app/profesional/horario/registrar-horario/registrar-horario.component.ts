import { Component, OnInit, Injectable } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbCalendarIslamicCivil } from '@ng-bootstrap/ng-bootstrap';
import { Calendar } from '@fullcalendar/core';
import { RangoFecha } from 'src/app/entidades/RangoFecha';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { esI18n } from 'src/app/esI18n';
import { Bloque } from 'src/app/entidades/Bloque_horario';


@Component({
  selector: 'app-registrar-horario',
  templateUrl: './registrar-horario.component.html',
  providers: [
    {provide: NgbDatepickerI18n, useClass: esI18n}
],
  styleUrls: ['./registrar-horario.component.css'],
})
export class RegistrarHorarioComponent implements OnInit {
  isDisabled = (date: NgbDate, current: {month: number}) => date.day < this.Dia.day && date.month<= this.Dia.month;
  minDate;
  hoveredDate: NgbDate;
  horaInicioLunes: string;
  horaFinLunes: string = null;
  horaInicioMartes: string;
  horaFinMartes: string = null;
  horaInicioMiercoles: string;
  horaFinMiercoles: string = null;
  horaInicioJueves: string;
  horaFinJueves: string = null;
  horaInicioViernes: string;
  horaFinViernes: string = null;
  horaInicioSabado: string;
  horaFinSabado: string = null;
  horaInicioDomingo: string;
  horaFinDomingo: string = null;
  checklunes: boolean = true;
  checkmartes: boolean= true;
  checkmiercoles: boolean= true;
  checkjueves: boolean= true;
  checkviernes: boolean= true;
  checksabado: boolean= true;
  checkdomingo: boolean= true;
  fromDate: NgbDate;
  Dia: NgbDate;
  toDate: NgbDate;
  listBloquesLunes: Bloque[] = [] ;
  listBloquesMartes: Bloque[] = [] ;
  listBloquesMiercoles: Bloque[] = [] ;
  listBloquesJueves: Bloque[] = [] ;
  listBloquesViernes: Bloque[] = [] ;
  listBloquesSabado: Bloque[] = [] ;
  listBloquesDomingo: Bloque[] = [] ;

  lunes: number = new Date().getDay();
  constructor(public restService: RestService, private calendar: NgbCalendar, private parseCalendar: NgbDateParserFormatter, private dia: NgbDatepickerI18n, private router: Router) {
    this.fromDate = calendar.getToday();
    this.Dia = calendar.getToday();
    this.minDate = {year: this.fromDate.year, month: this.fromDate.month, day: 1};

  }
  ngOnInit() {
    if (!this.restService.hasRole('ROLE_ESTETI')) {
      this.router.navigate(['login']);
    }
    this.restService.getProfesionalCorreo(this.restService.usuario.username).subscribe((res: any) => {
      this.restService.profesional = res;
    }, err =>{
      this.router.navigate(['login']);
    })
    this.restService.getListabloques().subscribe((res: any[]) => {
      this.restService.listaBloque = res;
    });
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }
  registrarHorario() {
    let fechaInicio: NgbDate = this.fromDate;
    let fechaFIn: NgbDate = this.toDate;
    let listaFecha: RangoFecha[]= [];
    let id: number = this.restService.profesional.id_profesional;
    let horaInicio;
    let horaFin;
    if (fechaInicio == null || fechaFIn == null) {
      console.log(this.horaFinDomingo);
      
      Swal.fire('Datos incorrectos', 'Verifique el ingreso de los datos', 'error');
    } else {
      
      do {
        let fechaDate: Date = new Date(this.parseCalendar.format(fechaInicio));
        if (fechaDate.getDay() == 0 && this.checklunes) {
          horaInicio = this.horaInicioLunes;
          horaFin = this.horaFinLunes;
          if( horaInicio== null || horaFin==null){
            Swal.fire('Datos incorrectos', 'Verifique el ingreso de los datos', 'error');
            return;
          }
        } else {
          if (fechaDate.getDay() == 1 && this.checkmartes) {
            horaInicio = this.horaInicioMartes;
            horaFin = this.horaFinMartes;
            if( horaInicio== null || horaFin==null){
              Swal.fire('Datos incorrectos', 'Verifique el ingreso de los datos', 'error');
              return;
            }
          } else {
            if (fechaDate.getDay() == 2 && this.checkmiercoles) {
              horaInicio = this.horaInicioMiercoles;
              horaFin = this.horaFinMiercoles;
              if( horaInicio== null || horaFin==null){
                Swal.fire('Datos incorrectos', 'Verifique el ingreso de los datos', 'error');
                return;
              }
            } else {
              if (fechaDate.getDay() == 3 && this.checkjueves) {
                horaInicio = this.horaInicioJueves;
                horaFin = this.horaFinJueves;
                if( horaInicio== null || horaFin==null){
                  Swal.fire('Datos Incorrectos', 'Verifique el ingreso de los datos', 'error');
                  return;
                }
              } else {
                if (fechaDate.getDay() == 4 && this.checkviernes) {
                  horaInicio = this.horaInicioViernes;
                  horaFin = this.horaFinViernes;
                  if( horaInicio== null || horaFin==null){
                    Swal.fire('Datos incorrectos', 'Verifique el ingreso de los datos', 'error');
                    return;
                  }
                } else {
                  if (fechaDate.getDay() == 5 && this.checksabado) {
                    horaInicio = this.horaInicioSabado;
                    horaFin = this.horaFinSabado;
                    if( horaInicio== null || horaFin==null){
                      Swal.fire('Datos incorrectos', 'Verifique el ingreso de los datos', 'error');
                      return;
                    }
                  } else {
                    if (fechaDate.getDay() == 6 && this.checkdomingo) {
                      horaInicio = this.horaInicioDomingo;
                      horaFin = this.horaFinDomingo;
                      if( horaInicio== null || horaFin==null){
                        Swal.fire('Datos incorrectos', 'Verifique el ingreso de los datos', 'error');
                        return;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        let fecha: string = this.parseCalendar.format(fechaInicio);
        let rangoFecha: RangoFecha = { id, fecha, horaInicio, horaFin };
        if( horaInicio!= null || horaFin!=null){
          console.log(rangoFecha +"    "+fechaDate.getDay());
          listaFecha.push(rangoFecha);
        }
        horaInicio=null;
        horaFin=null;
        fechaInicio = this.calendar.getNext(fechaInicio, "d", 1);
      } while (!fechaInicio.after(fechaFIn));
        listaFecha.forEach(element => {
          this.restService.saveHorario(element).subscribe(() => {
            return this.restService.getListaProfesional().subscribe((res: any[]) => {
              this.restService.listaProfesional = res;
            },
              err => console.log(err));
          });
          
        });
        Swal.fire('Horario registrado', 'el horario fue agregado ', 'success');
        this.router.navigate(['profesional/horario']);
    }
  }
  limitarLunes(){
    this.listBloquesLunes=[];
    this.restService.listaBloque.forEach(element => {
      if(element.diaSemana == "1" && element.horaInicio >= this.horaInicioLunes){
        this.listBloquesLunes.push(element);
      }
    });
    this.horaFinLunes = null;
  }
  limitarMartes(){
    this.listBloquesMartes=[];
    this.restService.listaBloque.forEach(element => {
      if(element.diaSemana == "2" && element.horaInicio >= this.horaInicioMartes){
        this.listBloquesMartes.push(element);
      }
    });
    this.horaFinMartes = null;
  }
  limitarMiercoles(){
    this.listBloquesMiercoles=[];
    this.restService.listaBloque.forEach(element => {
      if(element.diaSemana == "3" && element.horaInicio >= this.horaInicioMiercoles){
        this.listBloquesMiercoles.push(element);
      }
    });
    this.horaFinMiercoles = null;
  }
  limitarJueves(){
    this.listBloquesJueves=[];
    this.restService.listaBloque.forEach(element => {
      if(element.diaSemana == "4" && element.horaInicio >= this.horaInicioJueves){
        this.listBloquesJueves.push(element);
      }
    });
    this.horaFinJueves = null;
  }
  limitarViernes(){
    this.listBloquesJueves=[];
    this.restService.listaBloque.forEach(element => {
      if(element.diaSemana == "5" && element.horaInicio >= this.horaInicioViernes){
        this.listBloquesViernes.push(element);
      }
    });
    this.horaFinViernes = null;
  }
   limitarSabado(){
    this.listBloquesJueves=[];
    this.restService.listaBloque.forEach(element => {
      if(element.diaSemana == "6" && element.horaInicio >= this.horaInicioSabado){
        this.listBloquesSabado.push(element);
      }
    });
    this.horaFinSabado = null;
  }
  limitarDomingo(){
    this.listBloquesJueves=[];
    this.restService.listaBloque.forEach(element => {
      if(element.diaSemana == "0" && element.horaInicio >= this.horaInicioDomingo){
        this.listBloquesDomingo.push(element);
      }
    });
    this.horaFinDomingo = null;
  }
}
