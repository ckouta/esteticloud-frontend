import { Component, OnInit } from '@angular/core';
import { Servicio } from 'src/app/entidades/Servicio';
import { RestService } from '../../servicioBackend/rest.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Calendar } from '@fullcalendar/core';

@Component({
  selector: 'app-profesional-servicio',
  templateUrl: './profesional-servicio.component.html',
  styleUrls: ['./profesional-servicio.component.css']
})
export class ProfesionalServicioComponent implements OnInit {

 
  constructor(public restService: RestService) { }

  ngOnInit() {
    this.restService.getListaServicio().subscribe((res: any[]) => {
      this.restService.listaServicio = res;
      });
  }

}
