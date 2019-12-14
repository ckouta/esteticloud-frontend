import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';


@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})

export class ServicioComponent implements OnInit{

  constructor(public restService: RestService) { }

  ngOnInit() {
    this.restService.getListaServicio().subscribe((res: any[]) => {
      this.restService.listaServicio = res;
      });
  }
}
