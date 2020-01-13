import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { RangoFecha } from 'src/app/entidades/RangoFecha';

import Swal from 'sweetalert2';
import { HorarioProfesional } from 'src/app/entidades/HorarioProfesional';
import { NgbDateStruct, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-lista-horario',
  templateUrl: './lista-horario.component.html',
  styleUrls: ['./lista-horario.component.css']
})
export class ListaHorarioComponent implements OnInit {

  constructor(public restService: RestService,
    private parseCalendar: NgbDateParserFormatter,
    private calendar: NgbCalendar) { 
      this.model = this.calendar.getToday();
    }
  horasProfesional:HorarioProfesional[];
  fecha:RangoFecha=null;
  model:NgbDateStruct;
  

  ngOnInit() {
    this.restService.getProfesionalCorreo(this.restService.usuario.username).subscribe((res: any) => {
      this.restService.profesional = res;
      let fecha: RangoFecha = {id:this.restService.profesional.id_profesional,fecha:this.parseCalendar.format(this.model),horaInicio:null,horaFin:null};
    this.restService.getHorarioprofesionalfecha(fecha).subscribe((res: any[]) => {
      this.horasProfesional = res;
      
    });
    })
    
  }

  horario(){
    let fecha: RangoFecha = {id:this.restService.profesional.id_profesional,fecha:this.parseCalendar.format(this.model),horaInicio:null,horaFin:null};
    this.restService.getHorarioprofesionalfecha(fecha).subscribe((res: any[]) => {
      this.horasProfesional = res;
     
    }
    );
  }
  eliminarHorario(id:number){
    this.restService.deleteHorario(id).subscribe((res: any[]) => {
      this.horario();
      Swal.fire('Eliminación correcta', 'el horario fue eliminado', 'success');
    }, err => {
      Swal.fire('Error al eliminar', 'no se logro eliminar el horario', 'error');
    })
  }
}
