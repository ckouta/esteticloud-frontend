import { Component, OnInit } from '@angular/core';
import { Profesional } from 'src/app/Profesional';
import { RestService } from '../../servicioBackend/rest.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-listar-profesionales',
  templateUrl: './listar-profesionales.component.html',
  styleUrls: ['./listar-profesionales.component.css']
})
export class ListarProfesionalesComponent implements OnInit {

  
  constructor( public restService: RestService ) { }

  ngOnInit() {
    this.restService.getListaProfesional().subscribe((res: any[]) => {
      this.restService.listaProfesional = res;
      });
  }

}
