import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {
  searchText:string;
  constructor( public restService: RestService) { }

  ngOnInit() {
    this.restService.getListaProfesional().subscribe((res: any[]) => {
      this.restService.listaProfesional = res;
      });
  }

}
