import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Servicio } from '../../entidades/Servicio'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { Profesional } from 'src/app/entidades/Profesional';
import { NgbDatepickerI18n, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import localeEs from '@angular/common/locales/es';
import { HorarioProfesional } from 'src/app/entidades/HorarioProfesional';
import { RangoFecha } from 'src/app/entidades/RangoFecha';
import { HorarioPosible } from 'src/app/entidades/HorarioPosible';
import { Router } from '@angular/router';
import { Reserva } from 'src/app/entidades/Reserva';
import { element } from 'protractor';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit, OnChanges {
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  arreglo: String[] = ["", "current", "done", "done", "done"];
  variable: number = 1;
  listServicios: Servicio[];
  listProfesionales: Profesional[];
  horasProfesional: HorarioProfesional[];
  bloquesPosibles: HorarioPosible[] = [];
  model: NgbDateStruct; // establecer fecha  para la reserva
  valor: String = "done";
  servicio: Servicio;
  esteticista: any = 0;
  hora: any = 0;
  reserva: Reserva;
  constructor(public restService: RestService,
    private calendar: NgbCalendar,
    private ngbDatepickerI18n: NgbDatepickerI18n,
    private router: Router,
    private parseCalendar: NgbDateParserFormatter) {
    this.model = this.calendar.getToday();

  }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_CLIENT')) {
      this.router.navigate(['']);
    }
    this.restService.getListaServicio().subscribe((res: any[]) => {
      this.listServicios = res;
    });
    this.restService.getListaProfesional().subscribe((res: any[]) => {
      this.listProfesionales = res;
    });
  }
  ngOnChanges() {

  }
  press(servicio: Servicio) {
    this.variable = this.variable + 1;
    this.servicio = servicio;
    if (this.esteticista != 0) {
      let fecha: RangoFecha = { id: this.esteticista.id_profesional, fecha: this.parseCalendar.format(this.model), horaInicio: null, horaFin: null };
      this.restService.getHorarioprofesionalfecha(fecha).subscribe((res: any[]) => {
        this.horasProfesional = res;
        this.bloquesHorario();
      });
    }
  }
  agregarServicio(sv: Servicio) {
    this.listServicios.push(sv);
  }
  onDateSelection(date: NgbDate) {
    console.log(this.model);
  }
  //para agregar horarios posibles para reservar
  bloquesHorario() {
    let valor: number = this.servicio.duracion / 10;
    for (let i = 0; i <= this.horasProfesional.length - valor; i++) {
      let bloque: HorarioPosible = {
        horaInicio: this.horasProfesional[i].bloque_horario.horaInicio,
        horaFin: null,
        horarioProfesional: [],
      }
      for (let j = 0; j < valor; j++) {
        if (this.horasProfesional[i + j].reserva != null) {
          break;
        }
        if (this.horasProfesional[i + j + 1] == null || this.horasProfesional[i + j].bloque_horario.horaFin != this.horasProfesional[i + j + 1].bloque_horario.horaInicio) {
          break;
        }
        bloque.horarioProfesional.push(this.horasProfesional[i + j]);
        if (j + 1 == valor - 1) {
          bloque.horaFin = this.horasProfesional[i + j + 1].bloque_horario.horaFin;
          this.bloquesPosibles.push(bloque);
        }
      }
    }
  }
  Select() {
    this.bloquesPosibles = [];
    if (this.esteticista != 0) {
      let fecha: RangoFecha = { id: this.esteticista.id_profesional, fecha: this.parseCalendar.format(this.model), horaInicio: null, horaFin: null };
      this.restService.getHorarioprofesionalfecha(fecha).subscribe((res: any[]) => {
        this.horasProfesional = res;
        this.bloquesHorario();
      });
    }
  }
  save() {
    this.variable = this.variable + 1;
    this.restService.getCliente(this.restService.usuario.username).subscribe(res => {

      this.reserva = {
        id_reserva: null,
        cliente: res,
        servicio: this.servicio,
        estado_reserva: null
      }
      this.restService.saveReserva(this.reserva).subscribe(res => {
        this.reserva = res;
        this.hora.horarioProfesional.forEach(element => {
          this.restService.updateHorarioReserva(element.id_horarioProfesional, res).subscribe(res => {
            console.log(res);
          })
        });
      })

    })

  }
  serviciosofrecidos(){
    if(this.esteticista==0){
      this.restService.getListaServicio().subscribe((res: any[]) => {
        this.listServicios = res;
      });
    }else{
      this.listServicios=[];
      this.restService.getListaServicioOfrecidoporProfesional(this.esteticista).subscribe((res: any[]) => {
        
        res.forEach(element=>{
          this.listServicios.push(element.servicio);
        })
      });
    }
  }
}
