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
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  li:string ='mes';
  calendarEvents = [
    { title: 'event 2', start: '2019-10-17T10:30:00', end: '2019-10-17T11:30:00' }
  ];
  Evento: Evento = {
    title: "event 1",
    start: '2019-11-17',
    end: '2019-11-17',
    description: '2019-10-17'
  };

  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;
  horasProfesional: HorarioProfesional[] = [];

  constructor(public restService: RestService,private router: Router) { }



  addEvent() {
    this.calendarEvents = this.calendarEvents.concat( // creates a new array!
      //{ title: 'event 2',start: '2019-10-17T10:00:00',end: '2019-10-17T11:00:00' }
      this.Evento
    );
  }

  ngOnInit() {
    if(!this.restService.hasRole('ROLE_ESTETI') && !this.restService.hasRole('ROLE_ADMIN') ){
      this.router.navigate(['login']);
    }
    this.restService.getProfesional(this.restService.usuario.username).subscribe((res:any) =>{
      this.restService.profesional =res;
      this.reservas(this.restService.profesional);
    })
    this.restService.getListaProfesional().subscribe((res: any[]) => {
      this.restService.listaProfesional = res;
    });
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
    this.li='dia';
    let calendar = this.calendarComponent.getApi();
    calendar.changeView('timeGridDay');
  }
  formatoMes() {
    this.li='mes';
    let calendar = this.calendarComponent.getApi();
    calendar.changeView('dayGridMonth');
  }
  formatoSemana() {
    this.li='semana';
    let calendar = this.calendarComponent.getApi();
    calendar.changeView('timeGridWeek');
  }
  AgregarEvento() {

    let calendar = this.calendarComponent.getApi();
    console.log(new Date().toDateString())
    calendar.addEvent({ title: "event 1", start: '2019-11-18T10:30:00', end: '2019-11-18T22:50:00', description: '2019-10-17', backgroundColor: '#A068F6' ,textColor: 'white'});
  }
  reservas(profesional:Profesional) {
    //obtener calendario
    let calendar = this.calendarComponent.getApi();
    //llamada para obtener todas las reservas a nombre del profesional
    this.restService.getHorarioprofesional(profesional).subscribe((res: any[]) => {
      this.horasProfesional = res;
      
      let id: number;//obtener id de la reserva
      let evento: Evento; // objeto de tipo evento para agregar al calendario
      for (let i = 0; i <= this.horasProfesional.length; i++) {

        if (id == null) {// Para comenzar se le asigna un arreglo y un nuevo evento
          id = this.horasProfesional[i].reserva.id_reserva;
          evento = {
            title: this.horasProfesional[i].reserva.cliente.nombre,
            start: this.horasProfesional[i].fecha + "T" + this.horasProfesional[i].bloque_horario.horaInicio,
            end: this.horasProfesional[i].fecha + "T" + this.horasProfesional[i].bloque_horario.horaFin,
            description: 'reserva'
          }
        }
        if(i==this.horasProfesional.length){//si ya es el ultimo ciclo agrega el evento
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
            description: 'reserva'
          }
        }
        
      }
    });

  }
}
