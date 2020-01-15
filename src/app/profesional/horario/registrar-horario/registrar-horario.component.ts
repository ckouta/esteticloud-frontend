import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Calendar } from '@fullcalendar/core';
import { RangoFecha } from 'src/app/entidades/RangoFecha';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-horario',
  templateUrl: './registrar-horario.component.html',
  styleUrls: ['./registrar-horario.component.css']
})
export class RegistrarHorarioComponent implements OnInit {

  hoveredDate: NgbDate;
  horaInicioLunes: string;
  horaFinLunes: string;
  horaInicioMartes: string;
  horaFinMartes: string;
  horaInicioMiercoles: string;
  horaFinMiercoles: string;
  horaInicioJueves: string;
  horaFinJueves: string;
  horaInicioViernes: string;
  horaFinViernes: string;
  horaInicioSabado: string;
  horaFinSabado: string;
  horaInicioDomingo: string;
  horaFinDomingo: string;
  checklunes: boolean = true;
  checkmartes: boolean= true;
  checkmiercoles: boolean= true;
  checkjueves: boolean= true;
  checkviernes: boolean= true;
  checksabado: boolean= true;
  checkdomingo: boolean= true;
  fromDate: NgbDate;
  toDate: NgbDate;

  lunes: number = new Date().getDay();
  constructor(public restService: RestService, private calendar: NgbCalendar, private parseCalendar: NgbDateParserFormatter, private dia: NgbDatepickerI18n) {
    this.fromDate = calendar.getToday();

  }

  ngOnInit() {
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
    let id: number = 1;
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
      console.log(listaFecha);
    }
  }

}
