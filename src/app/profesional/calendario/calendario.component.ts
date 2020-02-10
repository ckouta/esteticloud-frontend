import { Component, OnInit, ViewChild, SystemJsNgModuleLoader } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { OptionsInput, Calendar, View } from '@fullcalendar/core';
import { esLocale } from '@fullcalendar/core/locales/es';
import { Evento } from '../../entidades/EventCalendario';
import { RangoFecha } from 'src/app/entidades/RangoFecha';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { HorarioProfesional } from 'src/app/entidades/HorarioProfesional';
import { Profesional } from 'src/app/entidades/Profesional';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/entidades/Cliente';
import { Servicio } from 'src/app/entidades/Servicio';
import { HorarioPosible } from 'src/app/entidades/HorarioPosible';
import { Reserva } from 'src/app/entidades/Reserva';
import { esI18n } from 'src/app/esI18n';
import { estado } from 'src/app/entidades/Estado';
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  providers: [
    { provide: NgbDatepickerI18n, useClass: esI18n }
  ],
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  li: string = 'mes';
  display = 'none';
  display2 = 'none';

  calendarEvents = [
    { title: 'event 2', start: '2019-10-17T10:30:00', end: '2019-10-17T11:30:00' }
  ];
  Evento: Evento ;

  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;
  horasProfesional: HorarioProfesional[] = [];
  listaHoras: HorarioProfesional[] = [];
  listaServicios: Servicio[] = [];
  servicio: any = 0;
  formReserva: FormGroup;
  model: NgbDateStruct;
  hora: any = 0;
  listaClientes: Cliente[] = [];
  cliente: any = 0;
  bloquesPosibles: HorarioPosible[] = [];
  reserva: Reserva;
  selectReserva: any;
  listEstado:any;

  constructor(public restService: RestService, private router: Router, private formBuilder: FormBuilder, private parseCalendar: NgbDateParserFormatter,
    private calendar: NgbCalendar) {
    this.model = this.calendar.getToday();
    this.formReserva = this.formBuilder.group({
      id_reserva: [''],
      cliente: [{value: '', disabled: true}],
      servicio: [{value: '', disabled: true}],
      fecha:[{value: '', disabled: true}],
      hora: [{value: '', disabled: true}],
      estado: [{value: '', disabled: false}],
    });
  }



  addEvent() {
    this.calendarEvents = this.calendarEvents.concat( // creates a new array!
      //{ title: 'event 2',start: '2019-10-17T10:00:00',end: '2019-10-17T11:00:00' }
      this.Evento
    );
  }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_ESTETI') && !this.restService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['login']);
    }
    this.restService.getProfesionalCorreo(this.restService.usuario.username).subscribe((res: any) => {
      this.restService.profesional = res;
      this.reservas(this.restService.profesional);
    })
    this.restService.getListaCliente().subscribe((res: any[]) => {
      this.listaClientes = res;
    });
    this.restService.getListaServicio().subscribe((res: any[]) => {
      this.listaServicios = res;
    });
    this.restService.getListEstadoReserva().subscribe((res => {
      this.listEstado= res;
    }));
  }
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarLanguaje = esLocale;

  someMethod() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }
  //[views]="{dayGridMonth:{buttonText: '2 days'}}"
  formatoDia() {
    this.li = 'dia';
    let calendar = this.calendarComponent.getApi();
    calendar.changeView('timeGridDay');
  }
  formatoMes() {
    this.li = 'mes';
    let calendar = this.calendarComponent.getApi();
    calendar.changeView('dayGridMonth');
  }
  formatoSemana() {
    this.li = 'semana';
    let calendar = this.calendarComponent.getApi();
    calendar.changeView('timeGridWeek');
  }
  AgregarEvento() {

    let calendar = this.calendarComponent.getApi();
    console.log(new Date().toDateString())
    calendar.addEvent({ title: "event 1", start: '2019-11-18T10:30:00', end: '2019-11-18T22:50:00', description: '2019-10-17', backgroundColor: '#A068F6', textColor: 'white' });
  }
  reservas(profesional: Profesional) {
    //obtener calendario
    let calendar = this.calendarComponent.getApi();
    //llamada para obtener todas las reservas a nombre del profesional
    this.restService.getHorarioprofesional(profesional).subscribe((res: any[]) => {
      this.horasProfesional = res;

      let id: number;//obtener id de la reserva
      let evento: Evento; // objeto de tipo evento para agregar al calendario
      let estado:any;
      for (let i = 0; i <= this.horasProfesional.length; i++) {

        if (id == null) {// Para comenzar se le asigna un arreglo y un nuevo evento
          id = this.horasProfesional[i].reserva.id_reserva;
          evento = {
            title: this.horasProfesional[i].reserva.cliente.nombre,
            start: this.horasProfesional[i].fecha + "T" + this.horasProfesional[i].bloque_horario.horaInicio,
            end: this.horasProfesional[i].fecha + "T" + this.horasProfesional[i].bloque_horario.horaFin,
            description: ""+this.horasProfesional[i].id_horarioProfesional,
            backgroundColor: "",
            borderColor: "#e9ecef"
          }
          estado = this.horasProfesional[i].reserva.estado_reserva;
          evento.backgroundColor= this.colorSegunEstado(estado.id_estado_reserva);
          
        }
        if (i == this.horasProfesional.length) {//si ya es el ultimo ciclo agrega el evento
          calendar.addEvent(evento);
          break;
        }
        if (id == this.horasProfesional[i].reserva.id_reserva) {//actualiza la hora final dependiendo si el id de la reserva coincide
          evento.end = this.horasProfesional[i].fecha + "T" + this.horasProfesional[i].bloque_horario.horaFin;
        } else {// si no coincide el id significa que se acabaron sus bloques y comienza una nueva reserva
          calendar.addEvent(evento);
          id = this.horasProfesional[i].reserva.id_reserva;
          evento = {
            title: this.horasProfesional[i].reserva.cliente.nombre,
            start: this.horasProfesional[i].fecha + "T" + this.horasProfesional[i].bloque_horario.horaInicio,
            end: this.horasProfesional[i].fecha + "T" + this.horasProfesional[i].bloque_horario.horaFin,
            description: ""+this.horasProfesional[i].id_horarioProfesional,
            backgroundColor: "",
            borderColor:"#e9ecef"
          }
          estado = this.horasProfesional[i].reserva.estado_reserva;
          evento.backgroundColor= this.colorSegunEstado(estado.id_estado_reserva);

        }

      }
    });

  }
  /**
   * Retorna un strign del color hexadecimal (#rrggbb) de acuerdo al id del estado
   */
  colorSegunEstado(estado: Number){
    switch (estado) {
      case 1:       
        return '#08D2EF';
      case 2:       
        return '#08EF24';
      case 3:       
        return '#EF9808';
      case 4:       
        return '#EF5E08';  
      case 5:       
        return '#D3EF08';
      default:
        return '#EF2408';
    }
  }
  handleDateClick(arg) { // handler method
    this.display = 'block';
    this.model = this.parseCalendar.parse(arg.dateStr);
  }

  handleEventClick(arg) { // handler method
    console.log(arg.event);
    this.display2 = 'block';
    console.log(arg.event.extendedProps);
    let id:number = arg.event.extendedProps.description;
    this.restService.getHorario(id).subscribe((res: any) => {
      console.log(res);
      this.selectReserva = res ;
      this.formReserva.setValue({
        id_reserva: this.selectReserva.reserva.id_reserva,
      cliente: this.selectReserva.reserva.cliente.nombre+" "+this.selectReserva.reserva.cliente.apellido,
      servicio: this.selectReserva.reserva.servicio.nombre,
      fecha: this.selectReserva.fecha,
      hora: this.selectReserva.bloque_horario.horaInicio,
      estado: this.selectReserva.reserva.estado_reserva.id_estado_reserva,
      })
    })
    
}

changeEstado(e) {
  console.log(this.formReserva.getRawValue().estado);
}


openModal() {

  this.display = 'block';

}
onCloseHandled() {

  this.display = 'none';
  this.display2 = 'none';

}
Select() {
  this.bloquesPosibles = [];

  let fecha: RangoFecha = { id: this.restService.profesional.id_profesional, fecha: this.parseCalendar.format(this.model), horaInicio: null, horaFin: null };
  this.restService.getHorarioprofesionalfecha(fecha).subscribe((res: any[]) => {
    this.listaHoras = res;
    this.bloquesHorario();
  });

}
bloquesHorario() {
  let valor: number = this.servicio.duracion / 10;
  for (let i = 0; i <= this.listaHoras.length - valor; i++) {
    let bloque: HorarioPosible = {
      horaInicio: this.listaHoras[i].bloque_horario.horaInicio,
      horaFin: null,
      horarioProfesional: [],
    }
    for (let j = 0; j < valor; j++) {
      if (this.listaHoras[i + j].reserva != null) {
        break;
      }
      if (this.listaHoras[i + j + 1] == null || this.listaHoras[i + j].bloque_horario.horaFin != this.listaHoras[i + j + 1].bloque_horario.horaInicio) {
        break;
      }
      bloque.horarioProfesional.push(this.listaHoras[i + j]);
      if (j + 1 == valor - 1) {
        bloque.horaFin = this.listaHoras[i + j + 1].bloque_horario.horaFin;
        this.bloquesPosibles.push(bloque);
      }
    }
  }
}
save() {
  this.reserva = {
    id_reserva: null,
    cliente: this.cliente,
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
   
    Swal.fire('Solicitud aceptada', 'La reserva ha sido agregada', 'success');
      this.display = 'none';
      return this.router.navigate(['profesional/reserva'])
      
    }
    ,err =>{
        Swal.fire('Solicitud rechazada', 'La reserva no se pudo agregar', 'error');
      
  })
}
actualizarEstadoReserva(){
  this.reserva = this.selectReserva.reserva;
  this.reserva.estado_reserva = this.listEstado[this.formReserva.getRawValue().estado-1];
  this.restService.updateReserva(this.reserva.id_reserva,this.reserva).subscribe((res: any[]) => {
    this.onCloseHandled();
    Swal.fire('Solicitud aceptada', 'La reserva ha sido actualizada', 'success');
    let calendar = this.calendarComponent.getApi();
    calendar.removeAllEvents();
    this.reservas(this.restService.profesional);
  }, err =>{
    Swal.fire('Solicitud rechazada', 'La reserva no se pudo actualizar', 'error');
  });

}
}
