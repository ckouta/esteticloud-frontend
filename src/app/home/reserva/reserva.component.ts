import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Servicio } from '../../servicio'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';

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
  listServicios: Servicio[] = [];
  arregloServicios: Servicio[] = [
    {
      id_servicio: 1,
      nombre: "Corte de Pelo",
      duracion: "NO existe descripcion",
      precio: 345
    },
    {
      id_servicio: 1,
      nombre: "Corte de Pelo",
      duracion: "NO existe descripcion",
      precio: 345
    },
    {
      id_servicio: 1,
      nombre: "Corte de Pelo",
      duracion: "NO existe descripcion",
      precio: 345
    },
    {
      id_servicio: 1,
      nombre: "Corte de Pelo",
      duracion: "NO existe descripcion",
      precio: 345
    },
    {
      id_servicio: 1,
      nombre: "Corte de Pelo",
      duracion: "NO existe descripcion",
      precio: 345
    },
    {
      id_servicio: 1,
      nombre: "Corte de Pelo",
      duracion: "NO existe descripcion",
      precio: 345
    },
    {
      id_servicio: 1,
      nombre: "Corte de Pelo",
      duracion: "NO existe descripcion",
      precio: 345
    }
  ];
  valor: String = "done";
  constructor() { }

  ngOnInit() {
  }

  press() {
    this.variable = this.variable + 1;
  }
  agregarServicio(sv:Servicio){
    this.listServicios.push(sv);
  }
}
