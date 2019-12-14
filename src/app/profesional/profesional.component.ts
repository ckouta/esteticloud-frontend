import { Component, OnInit } from '@angular/core';
import { RestService } from '../servicioBackend/rest.service';

@Component({
  selector: 'app-profesional',
  templateUrl: './profesional.component.html',
  styleUrls: ['./profesional.component.css']
})
export class ProfesionalComponent implements OnInit {

  constructor(private restService: RestService) { }

  ngOnInit() {
  }
  cerrarSesion(){
    this.restService.logout();
  }
}
