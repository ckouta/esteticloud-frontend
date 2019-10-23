import { Component, OnInit, ViewChild, SystemJsNgModuleLoader } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { OptionsInput,Calendar, View } from '@fullcalendar/core';
import {esLocale }  from '@fullcalendar/core/locales/es';
import { Evento} from '../../EventCalendario';
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  calendarEvents = [
    { title: 'event 2',start: '2019-10-17T10:30:00',end: '2019-10-17T11:30:00' }
  ];
  Evento : Evento[] =[{ title: "event 1", start: '2019-10-17T10:30:00' ,end:'2019-10-17T10:30:00',description:'2019-10-17'}];
  
  @ViewChild('calendar',{static: false}) calendarComponent: FullCalendarComponent;
  
  constructor() { }
  


  addEvent() {
    this.calendarEvents = this.calendarEvents.concat( // creates a new array!
      { title: 'event 2',start: '2019-10-17T10:00:00',end: '2019-10-17T11:00:00' }
    );
  }

  ngOnInit() {

  }
  calendarPlugins = [dayGridPlugin,timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarLanguaje = esLocale;
  
  someMethod() {
    
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
    
    
   
  }
  //[views]="{dayGridMonth:{buttonText: '2 days'}}"
  formatoDia(){
    let calendar = this.calendarComponent.getApi();
    calendar.changeView('timeGridDay');
  }
  formatoMes(){
    let calendar = this.calendarComponent.getApi();
    calendar.changeView('dayGridMonth');
  }
  formatoSemana(){
    let calendar = this.calendarComponent.getApi();
    calendar.changeView('timeGridWeek');
  }
  AgregarEvento(){
    
    let calendar = this.calendarComponent.getApi();
    console.log(new Date().toDateString())
    calendar.addEvent({ title: "event 1", start: '2019-10-17T10:30:00' ,end:'2019-10-17T10:30:00',description:'2019-10-17'});
  }
  
}
