import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';


@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})

export class ServicioComponent implements OnInit{
  searchText:string;
  servicio:number=0;
  constructor(public restService: RestService) { }

  ngOnInit() {
    this.restService.getListaServicio().subscribe((res: any[]) => {
      this.restService.listaServicio = res.sort(function (a, b) {
        if (a.nombre > b.nombre) {
          return 1;
        }
        if (a.nombre < b.nombre) {
          return -1;
        }
        return 0;
      });
      });
  }
  ordenar(){
    if(this.servicio==0){
      this.restService.listaServicio.sort(function (a, b) {
        if (a.nombre > b.nombre) {
          return 1;
        }
        if (a.nombre < b.nombre) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    }
    if(this.servicio==1){
      this.restService.listaServicio.sort(function (a, b) {
        if (a.precio < b.precio) {
          return 1;
        }
        if (a.precio > b.precio) {
          return -1;
        }
        return 0;
      });
    }
    if(this.servicio==2){
      this.restService.listaServicio.sort(function (a, b) {
        if (a.precio > b.precio) {
          return 1;
        }
        if (a.precio < b.precio) {
          return -1;
        }
        return 0;
      });
    }
  }
}
