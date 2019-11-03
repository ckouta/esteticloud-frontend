import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Servicio } from '../../servicio'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { RestService } from 'src/app/servicioBackend/rest.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  calendarPlugins = [dayGridPlugin,timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  arreglo: String[] = ["", "current", "done", "done", "done"];
  variable: number = 1;
  listServicios: Servicio[];
  
  valor: String = "done";
  constructor(public restService: RestService) { }

  ngOnInit() {
    this.restService.getListaServicio().subscribe((res: any[]) => {
      this.listServicios = res;
      });
  }

  press() {
    this.variable = this.variable + 1;
  }
  agregarServicio(sv:Servicio){
    this.listServicios.push(sv);
  }
}
