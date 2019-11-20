import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { RangoFecha } from 'src/app/entidades/RangoFecha';

import Swal from 'sweetalert2';
import { HorarioProfesional } from 'src/app/entidades/HorarioProfesional';
@Component({
  selector: 'app-lista-horario',
  templateUrl: './lista-horario.component.html',
  styleUrls: ['./lista-horario.component.css']
})
export class ListaHorarioComponent implements OnInit {

  constructor(public restService: RestService) { }
  horasProfesional:HorarioProfesional[];
  fecha:RangoFecha=null;

  ngOnInit() {
    let fecha: RangoFecha = {id:1,fecha:"2019-11-08",horaInicio:null,horaFin:null};
    this.restService.getHorarioprofesionalfecha(fecha).subscribe((res: any[]) => {
      this.horasProfesional = res;
      console.log(this.horasProfesional);
    });
  }

}
