import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {


  constructor(public restService: RestService,  private router: Router) { }

  ngOnInit() {
  }
  abrirmodal(){
    if(this.restService.hasRole('ROLE_CLIENT')){
      this.router.navigate(['home/reserva']);

    }else{

    }
  }
}
