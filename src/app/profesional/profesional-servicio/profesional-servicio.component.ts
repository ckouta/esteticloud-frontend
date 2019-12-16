import { Component, OnInit } from '@angular/core';
import { Servicio } from 'src/app/entidades/Servicio';
import { RestService } from '../../servicioBackend/rest.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Calendar } from '@fullcalendar/core';
import { Router } from '@angular/router';
import { ServicioOfrecido } from 'src/app/entidades/ServicioOfrecido';

@Component({
  selector: 'app-profesional-servicio',
  templateUrl: './profesional-servicio.component.html',
  styleUrls: ['./profesional-servicio.component.css']
})
export class ProfesionalServicioComponent implements OnInit {
  searchText:string;
  serviciosOfrecido: ServicioOfrecido[] = [];
  serviciosNoOfrecido: Servicio[] = [];
  constructor(public restService: RestService, private router: Router) { }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_ESTETI') && !this.restService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['login']);
    }
    this.restService.getProfesional(this.restService.usuario.username).subscribe((res: any) => {
      this.restService.profesional = res;
      this.restService.getListaServicioOfrecidoporProfesional(this.restService.profesional).subscribe((res: any[]) => {

        this.serviciosOfrecido = res;
      })
      this.restService.getListaServicioOfrecidoNoASignadoProfesional(this.restService.profesional).subscribe((res: any[]) => {

        this.serviciosNoOfrecido = res;
      })
    })

  }
  eliminarServicioOfrecido(id: number) {
    this.restService.deleteServicioOfrecido(id).subscribe((res: any[]) => {
      this.restService.getListaServicioOfrecidoporProfesional(this.restService.profesional).subscribe((res: any[]) => {

        this.serviciosOfrecido = res;
      })
      this.restService.getListaServicioOfrecidoNoASignadoProfesional(this.restService.profesional).subscribe((res: any[]) => {

        this.serviciosNoOfrecido = res;
      })
    })
  }
  guardarServicioOfrecido(servi: Servicio) {
    let ServicioOfrecido: ServicioOfrecido = { id_servicioOfrecido: null, profesional: this.restService.profesional, servicio: servi };
    this.restService.saveServicioOfrecido(ServicioOfrecido).subscribe((res => {
      this.restService.getListaServicioOfrecidoNoASignadoProfesional(this.restService.profesional).subscribe((res: any[]) => {

        this.serviciosNoOfrecido = res;
      },err=>{
        this.serviciosNoOfrecido=[];
      }
      )
      this.restService.getListaServicioOfrecidoporProfesional(this.restService.profesional).subscribe((res: any[]) => {
        this.serviciosOfrecido = res;
      },err=>{
        this.serviciosOfrecido=[];
      })
    })
    )
  }


}
